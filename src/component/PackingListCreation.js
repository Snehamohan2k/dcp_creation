const PackingListCreation = (fileData, directoryName, directoryuuid) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString("<PackingList ></PackingList>", "application/xml");
  const now = new Date();
  const offsetMinutes = now.getTimezoneOffset();
  const offsetHours = Math.floor(offsetMinutes / 60);
  const offsetMinutesRemainder = Math.abs(offsetMinutes) % 60;
  const offsetSign = offsetHours > 0 ? "-" : "+";
  const offsetString = `${offsetSign}${Math.abs(offsetHours).toString().padStart(2, "0")}:${offsetMinutesRemainder.toString().padStart(2, "0")}`;
  const issuedate = now.toISOString().substr(0, 19) + offsetString;
  const directoryuuidNode = xml.createElement("Id");
  directoryuuidNode.textContent = "urn:uuid:" + directoryuuid;
  const AnnotationNode = xml.createElement("AnnotationText");
  AnnotationNode.textContent = directoryName;
  const issueDatenode = xml.createElement("IssueDate");
  issueDatenode.textContent = issuedate;
  const issuernode = xml.createElement("Issuer");
  issuernode.textContent = "Sneha";
  const creatornode = xml.createElement("Creator");
  creatornode.textContent = "QubeMaster";
  const filesNode = xml.getElementsByTagName("PackingList")[0];
  filesNode.setAttribute("xmlns", "http://www.smpte-ra.org/schemas/429-8/2007/PKL");
  filesNode.appendChild(directoryuuidNode);
  filesNode.appendChild(AnnotationNode);
  filesNode.appendChild(issueDatenode);
  filesNode.appendChild(issuernode);
  filesNode.appendChild(creatornode);
  const assetListNode = xml.createElement("AssetList");
  for (let i = 0; i < fileData.length; i++) {
    const file = fileData[i];
    console.log("Type:" + file.type);
    const assetNode = xml.createElement("Asset");
    const nameNode = xml.createElement("AnnotationText");
    nameNode.textContent = file.name;
    const uuidNode = xml.createElement("Id");
    uuidNode.textContent = "urn:uuid:" + file.uuid;
    const hashNode = xml.createElement("Hash");
    hashNode.textContent = file.hash;
    const sizeNode = xml.createElement("Size");
    sizeNode.textContent = file.size;
    const typeNode = xml.createElement("Type");
    typeNode.textContent = file.type;
    assetNode.appendChild(uuidNode);
    assetNode.appendChild(nameNode);
    assetNode.appendChild(hashNode);
    assetNode.appendChild(sizeNode);
    assetNode.appendChild(typeNode);
    assetListNode.appendChild(assetNode);
  }
  filesNode.appendChild(assetListNode);
  const serializer = new XMLSerializer();
  return serializer.serializeToString(xml);
}

export default PackingListCreation;
