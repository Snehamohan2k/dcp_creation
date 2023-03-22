function createSecondXml(fileData,directoryName,directoryuuid) {
    const parser = new DOMParser();
    const xml = parser.parseFromString("<AssetMap></AssetMap>", "application/xml");
    const now = new Date();
const offsetMinutes = now.getTimezoneOffset();
const offsetHours = Math.floor(offsetMinutes / 60);
const offsetMinutesRemainder = Math.abs(offsetMinutes) % 60;
const offsetSign = offsetHours > 0 ? "-" : "+";
const offsetString = `${offsetSign}${Math.abs(offsetHours).toString().padStart(2, "0")}:${offsetMinutesRemainder.toString().padStart(2, "0")}`;
const issuedate = now.toISOString().substr(0, 19) + offsetString;
    const directoryuuidNode = xml.createElement("Id");
    directoryuuidNode.textContent="urn:uuid:"+directoryuuid;
    const AnnotationNode = xml.createElement("AnnotationText");
    AnnotationNode.textContent=directoryName;
    const creatornode=xml.createElement("Creator");
    creatornode.textContent="QubeMaster";
    const VolumeNode=xml.createElement("VolumeCount");
    VolumeNode.textContent="1";
    const issueDatenode=xml.createElement("IssueDate");
    issueDatenode.textContent=issuedate;
    const issuernode=xml.createElement("Issuer");
    issuernode.textContent="Sneha";
   
    const AssetMapNode = xml.getElementsByTagName("AssetMap")[0];
    AssetMapNode.setAttribute("xmlns", "http://www.smpte-ra.org/schemas/429-9/2007/AM");
    AssetMapNode.appendChild(directoryuuidNode);
    AssetMapNode.appendChild(AnnotationNode);
    AssetMapNode.appendChild(creatornode);
    AssetMapNode.appendChild(VolumeNode);
    AssetMapNode.appendChild(issueDatenode);
    AssetMapNode.appendChild(issuernode);
 

  
    // AssetMapNode.appendChild(VolumeNode);
    const assetListNode = xml.createElement("AssetList");
   // const AssetListNode = xml.getElementsByTagName("AssetMap")[0];
    for (let i = 0; i < fileData.length; i++) {
      const file = fileData[i];
      const AssetNode = xml.createElement("Asset");
      const ChunkListNode = xml.createElement("ChunkList");
      //AssetNode.setAttribute("uuid", file.uuid);
      const uuidNode = xml.createElement("Id");
      uuidNode.textContent = "urn:uuid:"+file.uuid;

      const annotationTextNode = xml.createElement("AnnotationText");
      annotationTextNode.textContent = file.name;
      const ChunkNode = xml.createElement("Chunk");
      
      const pathNode = xml.createElement("Path");
      pathNode.textContent = file.path;    
      AssetNode.appendChild(uuidNode);
      AssetNode.appendChild(annotationTextNode);
      ChunkNode.appendChild(pathNode);
      ChunkListNode.appendChild(ChunkNode);
      AssetNode.appendChild(ChunkListNode);
      assetListNode.appendChild(AssetNode);
    }
    AssetMapNode.appendChild(assetListNode);
    const serializer = new XMLSerializer();
    return serializer.serializeToString(xml);
  }
  
  export default createSecondXml;
  