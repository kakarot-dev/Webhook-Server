const path = require("path");
const crypto = require("crypto");

const webhookSecret = process.env.HOOK_SECRET;
const supportedProtocol = "splashtail";
const tagLength = 16;
const ivLength = 12;

module.exports = async (client) => {
  const fastify = require("fastify")({ logger: true });

  fastify.register(require("@fastify/autoload"), {
    dir: path.join(__dirname, "../routes"),
  });

  fastify.addHook("preHandler", (req, res, done) => {
    req.client = client;
    console.log(req.headers);
    /**
     * THE FOLLOWING WILL PREVENT CORS FROM BLOCKING THE REQUEST
     */
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");

    done();
  });
  fastify.addHook("preHandler", async (req, res) => {
    parseEvent(
      req.body,
      webhookSecret,
      req.headers["x-webhook-nonce"],
      req.headers["x-webhook-signature"],
      req.headers["x-webhook-protocol"]
    ).then((result) => {
      if (result.authorized) {
        req.body = result.output;
      } else {
        res.code(result.statusCode).send({
          error: result.error,
          authorized: false,
        });
      }
    });
  });
  fastify.setNotFoundHandler(function (request, reply) {
    reply.code(404).send({
      message: "Route not found. Do you know what you are looking for?",
      error: true,
      fatal: false,
      status: 404,
    });
  });

  const start = async () => {
    try {
      fastify.listen({
        port: process.env.PORT || 3000,
        host: "0.0.0.0",
      });

      console.log("Webhook server is online chief!");
    } catch (err) {
      console.log(`Error while starting server: ${err.message}`);

      fastify.log.error(err.stack);

      process.exit(1);
    }
  };

  start();
};
const parseEvent = async function (
  requestBody,
  webhookSecret,
  webhookNonce,
  webhookSig,
  protocol
) {
  if (protocol != supportedProtocol) {
    return {
      authorized: false,
      error: "Invalid protocol version",
      statusCode: 403,
    };
  }

  if (!webhookNonce) {
    return {
      authorized: false,
      error: "Invalid nonce version",
      statusCode: 403,
    };
  }

  if (!requestBody) {
    return {
      authorized: false,
      error: "No request body provided",
      statusCode: 400,
    };
  }

  /**
   * CREATE HMAC 512 HASH
   */
  const signedBody = crypto
    .createHmac("sha512", webhookSecret)
    .update(requestBody)
    .digest("hex");

  /**
   * CREATE THE ACTUAL WEBHOOK SIGNATURE
   * USING X-WEBHOOK-NONCE BY PERFORMING
   * A SECOND HMAC
   */
  const expectedTok = crypto
    .createHmac("sha512", webhookNonce)
    .update(signedBody)
    .digest("hex");

  if (webhookSig != expectedTok) {
    console.log(`Expected: ${expectedTok} Got: ${webhookSig}`);
    return {
      authorized: false,
      error: "Invalid signature",
      statusCode: 403,
    };
  }

  /**
   * DECRYPT THE BODY USING SHA256 OF SECRET AS KEY AND
   * AES-256-GCM AS CIPHER (THE BODY IS IN HEX FORMAT)
   */
  try {
    const hashedKey = crypto
      .createHash("sha256")
      .update(webhookSecret + webhookNonce)
      .digest();

    const enc = Buffer.from(requestBody, "hex");
    const tag = enc.subarray(enc.length - tagLength, enc.length);
    const iv = enc.subarray(0, ivLength);
    const toDecrypt = enc.subarray(ivLength, enc.length - tag.length);
    const decipher = crypto.createDecipheriv("aes-256-gcm", hashedKey, iv);
    decipher.setAuthTag(tag);
    const res = Buffer.concat([decipher.update(toDecrypt), decipher.final()]);

    /**
     * PARSE THE DECRYPTED BODY
     */
    const data = JSON.parse(res.toString("utf-8"));

    return {
      authorized: true,
      error: "",
      statusCode: 200,
      output: data,
    };
  } catch (err) {
    console.log(err);
    return {
      authorized: false,
      error: "Invalid body",
      statusCode: 400,
    };
  }
};
