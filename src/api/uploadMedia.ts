import md5 from './md5';
import { BASE_URL } from './config';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


// 生成5位随机数
function generateRandomFiveDigitNumber() {

  const randomNumber =
    Math.floor(Math.random() * 100000);

  return String(randomNumber).padStart(5, '0');

}



// 获取公共请求参数
async function getUploadParams() {

  const userInfoString =
    await AsyncStorage.getItem('userinfo');


  const fixeduserinfo = {
    appKey: 1,
    appId: 1,
  };


  const storageClassList =
    userInfoString
      ? JSON.parse(userInfoString)
      : fixeduserinfo;



  const appKey =
    storageClassList.appKey;


  const appid =
    storageClassList.appId;



  const timestampInSeconds =
    Math.floor(Date.now() / 1000);



  const nonce =
    generateRandomFiveDigitNumber();



  const signText =
    `nonce=${nonce}&timestamp=${timestampInSeconds}&appkey=${appKey}`;



  const sign =
    md5(signText);



  return {

    appid,

    url:
    `?nonce=${nonce}&timestamp=${timestampInSeconds}&sign=${sign}`,

  };

}





/**
 * 上传音频
 *
 * audio:
 * {
 *  uri,
 *  name,
 *  type
 * }
 */
export async function uploadAudio(
  audio:any
) {


  // 没有音频直接返回空字符串
  if(!audio){

    return '';

  }



  try {


    const {
      appid,
      url
    } =
    await getUploadParams();



    const formData =
    new FormData();



    formData.append(
      'img',
      {

        uri:
        audio.uri,


        name:
        audio.name ||
        `audio_${Date.now()}.mp3`,


        type:
        audio.type ||
        audio.nativeType ||
        'audio/mpeg',

      } as any
    );




    const response =
    await fetch(
      `${BASE_URL}/upload/image${url}`,
      {

        method:'POST',

        headers:{

          appid:String(appid),

        },

        body:formData,

      }
    );



    const result =
    await response.json();



    // 上传成功
    if(
      result.code === 0 &&
      Array.isArray(result.data) &&
      result.data.length > 0
    ){

      return result.data[0];

    }


    // 没有文件
    return '';



  }catch(error){

    console.log(error);

    Alert.alert(
      '错误',
      '服务器连接异常，请检查网络再试'
    );

    throw error;

  }

}







/**
 * 上传视频
 *
 * videos:
 * [
 *  {
 *    path,
 *    mime,
 *    filename
 *  }
 * ]
 */
export async function uploadVideo(
  videos:any[]
) {


  // 空数组返回空字符串
  if(
    !videos ||
    videos.length===0
  ){

    return '';

  }



  try {


    const {
      appid,
      url
    } =
    await getUploadParams();



    const formData =
    new FormData();

    videos.forEach(
      (item,index)=>{
        formData.append(
          'img',
          {

            uri:
            item.path,


            name:
            `video_${Date.now()}_${index}.mp4`,


            type:
            item.mime ||
            'video/mp4',

          } as any
        );
      }
    );

    const response =
    await fetch(
      `${BASE_URL}/upload/image${url}`,
      {
        method:'POST',
        headers:{
          appid:String(appid),
        },
        body:formData,
      }
    );
    const result =
    await response.json();
if (
  result.code === 0 &&
  Array.isArray(result.data) &&
  result.data.length > 0
) {

  return result.data.join(',');

}


return '';



  }catch(error){


    console.log(error);


    Alert.alert(
      '错误',
      '服务器连接异常，请检查网络再试'
    );


    throw error;


  }

}







/**
 * 上传通用文件
 * 后续如果有其他文件可以复用
 */
export async function uploadFile(
  file:any,
  fieldName:string,
  uploadUrl:string,
){


  if(!file){

    return '';

  }



  const {
    appid,
    url
  } =
  await getUploadParams();



  const formData =
  new FormData();



  formData.append(
    fieldName,
    {

      uri:
      file.uri ||
      file.path,


      name:
      file.name ||
      file.filename ||
      `file_${Date.now()}`,


      type:
      file.type ||
      file.mime ||
      'application/octet-stream',

    } as any
  );



  const response =
  await fetch(
    `${BASE_URL}${uploadUrl}${url}`,
    {

      method:'POST',

      headers:{
        appid:String(appid),
      },

      body:formData,

    }
  );


  return response.json();

}