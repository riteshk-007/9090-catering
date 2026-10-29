import 'server-only'
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

/** The bucket is shared with other projects, so everything we store lives under our own prefixes. */
const PREFIXES = { gallery: '9090-catering/gallery/', menu: '9090-catering/menu/' } as const
export type R2Folder = keyof typeof PREFIXES

let client: S3Client | undefined
const s3 = () =>
  (client ??= new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
    },
  }))

const bucket = () => process.env.R2_PUBLIC_BUCKET ?? process.env.R2_BUCKET ?? ''

export function r2Configured() {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    bucket() &&
    process.env.R2_PUBLIC_URL
  )
}

export async function putImage(
  id: string,
  ext: string,
  body: Buffer,
  contentType: string,
  folder: R2Folder = 'gallery',
) {
  const key = `${PREFIXES[folder]}${id}.${ext}`
  await s3().send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  )
  return { key, url: `${process.env.R2_PUBLIC_URL!.replace(/\/$/, '')}/${key}` }
}

/** Only deletes keys inside our own prefix, never anything else in the shared bucket. */
export async function deleteImage(key: string) {
  if (!Object.values(PREFIXES).some((p) => key.startsWith(p)))
    throw new Error('Refusing to delete a key outside our own prefixes')
  await s3().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }))
}
