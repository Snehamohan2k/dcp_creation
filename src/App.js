//One progress bar
import React, { useState } from "react";
import mime from 'mime';
import createXml from "./component/createXml";
import createSecondXml from './component/createSecondXml'
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import { Progress } from 'antd';

function App() {
  const [hashes, setHashes] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0); 

  const handleUpload = async () => {
    const files = await window.showDirectoryPicker();
    const directoryuuid=uuidv4();
    const fileHandle = await files.getFileHandle("PackagingList.xml", { create: true });
    const fileHandleMap = await files.getFileHandle("ASSETmap.xml", { create: true });
       const writableStreamMap = await fileHandleMap.createWritable();
       const writableStream = await fileHandle.createWritable();
const fileData = [];
const totalFiles = fileData.length; // total number of files to be uploaded
  let filesUploaded = 0;
await getFilePaths(files);

async function getFilePaths(files, path ='') {
  const files2 = await files.values();
   // initialize filesUploaded counter

  for await (const entry of files2) {
    if (entry.kind === 'file') {
      const file = await entry.getFile();
      const newtype = mime.getType(file.name);
     // console.log(newtype);
      //console.log(file.type);
      const fileName = file.name;
      if (fileName.endsWith('.crswap'||'.DS_Store')) {
        continue;
      }
      else if(newtype==null)
      {
        continue;
      }
      const filePath = path ? `${path}/${fileName}` : fileName;
      console.log(fileName.split('.').pop());
      const { uuid, name, hash, size} = await hashFile(file,filesUploaded,totalFiles);
      fileData.push({ uuid, name, hash, size, type:newtype, path: filePath });
      
      setHashes(fileData);
    } else if (entry.kind === 'directory') {
      const directoryName = entry.name;
      if (directoryName.endsWith('.DS_Store')) {
        continue;
      }
      const directoryPath = path ? `${path}/${directoryName}` : directoryName;
      await getFilePaths(entry, directoryPath);
    }
  }
}

   const xmlData = createXml(fileData, files.name,directoryuuid);
    await writableStream.write(xmlData);
    await writableStream.close();
 const AssetData = createSecondXml(fileData,files.name,directoryuuid);
    await writableStreamMap.write(AssetData);
    await writableStreamMap.close();
  };

  const hashFile = async (file,filesUploaded,totalFiles) => {
const type=file.type
    var sha1 = CryptoJS.algo.SHA1.create();
    var chunkSize = 1024 * 1024; // 1 MB
    var hash;
   // console.log(file.type);
    const readNextChunk = (start, end) => {
      const fileSlice = file.slice(start, end);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const chunk = event.target.result;
          sha1.update(CryptoJS.lib.WordArray.create(chunk));
         
          resolve();
        };
        const progress = ((start + chunkSize) / file.size) * 100;
        console.log("Progress",progress);
        setUploadProgress((prev) => ({
                    ...prev,
                    [file.name]: progress,
                  }));
       // setUploadProgress(progress)
        reader.onerror = reject;
        reader.readAsArrayBuffer(fileSlice);
      });
    };
    let offset = 0;
    while (offset < file.size) {
      const start = offset;
      const end = offset + chunkSize;
      await readNextChunk(start, end);
      offset = end;
    }
    filesUploaded++; // increment filesUploaded counter
    // const overallProgress = (filesUploaded / totalFiles) * 100;
    //   setUploadProgress(overallProgress);
    hash = sha1.finalize().toString(CryptoJS.enc.Base64);
    console.log(hash);
    const uuid = uuidv4();
    //const type = file.type;
    const size = file.size;
    //console.log(type);
    return { uuid,name: file.name, size, hash ,type};
  };
  return (
    <div>
    <button onClick={handleUpload}> Choose a file</button>
    {hashes.map(file => (
      <div key={file.uuid}>
        <br></br>
        <span>{file.name}</span>
        <Progress percent={uploadProgress[file.name]} />
        <span>Verified</span>
        
      </div>
    ))}
   
  </div>
  );
      }
export default App;  
