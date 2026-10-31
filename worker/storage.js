// Photo storage. R2 is used when the binding exists, otherwise Workers KV (free plan, no
// payment method), otherwise the D1 database itself so a deployment with no object storage
// still works with a smaller per-file limit.
const DEFAULT_MIME='application/octet-stream';
export function maxUpload(env){if(env?.BUCKET)return 5*1024*1024;if(env?.KV)return 5*1024*1024;return 850*1024}
export function bucketFor(env){if(env?.BUCKET)return env.BUCKET;if(env?.KV)return kvBucket(env.KV);return d1Bucket(env.DB)}
function bufferOf(value){const bytes=value instanceof Uint8Array?value:new Uint8Array(value);return bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)}
function kvBucket(kv){return {
 async put(key,value,options){await kv.put(key,bufferOf(value),{metadata:{contentType:options?.httpMetadata?.contentType||DEFAULT_MIME}})},
 async get(key){const {value,metadata}=await kv.getWithMetadata(key,{type:'arrayBuffer'});if(!value)return null;const bytes=new Uint8Array(value);return {httpMetadata:{contentType:metadata?.contentType||DEFAULT_MIME},arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),body:bytes}},
 async delete(key){await kv.delete(key)}
}}
function d1Bucket(db){return {
 async put(key,value,options){const bytes=value instanceof Uint8Array?value:new Uint8Array(value);await db.prepare('INSERT INTO blobs(key,mime,bytes,created_at) VALUES(?,?,?,?) ON CONFLICT(key) DO UPDATE SET mime=excluded.mime,bytes=excluded.bytes').bind(key,options?.httpMetadata?.contentType||DEFAULT_MIME,bytes,Date.now()).run()},
 async get(key){const row=await db.prepare('SELECT mime,bytes FROM blobs WHERE key=?').bind(key).first();if(!row)return null;const bytes=row.bytes instanceof Uint8Array?row.bytes:new Uint8Array(row.bytes);return {httpMetadata:{contentType:row.mime||DEFAULT_MIME},arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),body:bytes}},
 async delete(key){await db.prepare('DELETE FROM blobs WHERE key=?').bind(key).run()}
}}
