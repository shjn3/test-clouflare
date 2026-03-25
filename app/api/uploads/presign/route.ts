import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ACCOUNT_ID = 'b2beffacb9f79d59a56348879857cead'
const ACCESS_KEY_ID = 'f4112e555214f3b4781889ffca1fd4da'
const SECRET_ACCESS_KEY = '61dc280efe9f771e75ab95fced9febab6d50aef27b6768241dab9ebb5acbaa69'
const BUCKET_NAME = 'public-game'
const endpoint = "https://b2beffacb9f79d59a56348879857cead.r2.cloudflarestorage.com/public-game"
// endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,



const s3 = new S3Client({
    region: 'auto',
    endpoint: endpoint,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY
    }
})

export async function POST(req: Request) {
    const { fileName } = await req.json();
    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
        ContentType: "application/zip",
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return Response.json({ url });
}