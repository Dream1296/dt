import SparkMD5 from "spark-md5"


export function getFileMd5(file: ArrayBuffer): string {
    const md5 = SparkMD5.ArrayBuffer.hash(file)
    return md5
}