import React, { useState } from "react";
import mime from 'mime';
import PackingListCreation from "./component/PackingListCreation";
import AssetMapCreation from './component/AssetMapCreation'
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import VerifyProgress from "./component/VerifyProgress";
import  Header  from "./component/Header";
function App() {
  const [hashes, setHashes] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const handleUpload = async () => {
    const directory = await window.showDirectoryPicker();
    const directoryuuid = uuidv4();
    const pklFileHandle = await directory.getFileHandle(`${directory.name}.pkl.xml`, { create: true });
    const AssetMapFileHandle = await directory.getFileHandle("ASSETMAP.xml", { create: true });
    const pklWritableStream = await pklFileHandle.createWritable();
    const AssetMapWritableStream = await AssetMapFileHandle.createWritable();
    const fileData = [];
    await getFilePaths(directory);
    async function getFilePaths(directory, path = '') {
      const directoryfiles = await directory.values();
      for await (const entry of directoryfiles) {
        if (entry.kind === 'file') {
          const file = await entry.getFile();
          const uuid= uuidv4();
          const fileName = file.name;
          const mimeType = mime.getType(file.name);
          const size = file.size;
          if ((fileName.endsWith('.crswap')) || (size === 0)) {
            continue;
          }
          const filePath = path ? `${path}/${fileName}` : fileName;
          const hash  = await hashFile(file,size);
          fileData.push({ uuid, name:fileName, hash, size, type: mimeType, path: filePath });
          setHashes(fileData);
        } else if (entry.kind === 'directory') {
          const directoryName = entry.name;
          const directoryPath = path ? `${path}/${directoryName}` : directoryName;
          await getFilePaths(entry, directoryPath);
        }
      }
    }
    const pklXmlData = PackingListCreation(fileData, directory.name, directoryuuid);
    await pklWritableStream.write(pklXmlData);
    await pklWritableStream.close();
    //pkl in assetmap
    const pkldirectory = await directory.values();
    for await (const entry of pkldirectory) {
      if (entry.kind === 'file') {
        const pklfile = await entry.getFile();
        if (pklfile.name === `${directory.name}.pkl.xml`) {
          var uuid = uuidv4()
          // var { uuid, name, hash, size} = await hashFile(pklfile);
          const fileNamepkl = pklfile.name;
          // const newtypepkl = mime.getType(pklfile.name);
          fileData.push({ uuid, name: fileNamepkl, path: fileNamepkl });
          setHashes(fileData);
          console.log("FILEdata:", fileData);
        }
      }
    }
    const AssetMapData = AssetMapCreation(fileData, directory.name, directoryuuid);
    await AssetMapWritableStream.write(AssetMapData);
    await AssetMapWritableStream.close();
  };
  const hashFile = async (file,size) => {
    var sha1 = CryptoJS.algo.SHA1.create();
    var chunkSize = 1024 * 1024; // 1 MB
    var hash;
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
        const estimatedTime = Math.ceil((file.size - (start + chunkSize)) / chunkSize);
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: {
            progress: progress,
            estimatedTime: estimatedTime
          }
        }));
        reader.onerror = reject;
        reader.readAsArrayBuffer(fileSlice);
      });
    };
    let offset = 0;
    while (offset < size) {
      const start = offset;
      const end = offset + chunkSize;
      await readNextChunk(start, end);
      offset = end;
    }
    hash = sha1.finalize().toString(CryptoJS.enc.Base64);
    console.log(hash);
    return hash ;
  };
  return (
    <div>
        <Header/>
      <button onClick={handleUpload}> Choose a file</button>
      <div>
        <VerifyProgress uploadProgress={uploadProgress} />
      </div>
    </div>
  );
}
export default App;  