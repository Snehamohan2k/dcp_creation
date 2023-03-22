
function createXml(fileData,directoryName,directoryuuid) {
    //   console.log("Hi");
    // console.log(fileData);
      // var offset=new Date().getTimezoneOffset();
    
      // const currentDate=new Date().toISOString();
      
      // const issuedate = (currentDate.substr(0, 19) + `${offset}`);
      // console.log(issuedate); // 
      // function getLocalISOString(date) {
      //   const offset = date.getTimezoneOffset()
      //   const offsetAbs = Math.abs(offset)
      //   const isoString = new Date(date.getTime() - offset * 60 * 1000).toISOString()
      //   return `${isoString.slice(0, -1)}${offset > 0 ? '-' : '+'}${String(Math.floor(offsetAbs / 60)).padStart(2, '0')}:${String(offsetAbs % 60).padStart(2, '0')}`
      // }
      // const minutesToOffsetString = minutes => {
      //   const sign = minutes >= 0 ? "+" : "-";
      //   const hours = Math.floor(Math.abs(minutes) / 60);
      //   const minutesRemainder = Math.abs(minutes) % 60;
      //   return `${sign}${hours.toString().padStart(2, "0")}:${minutesRemainder.toString().padStart(2, "0")}`;
      // };
      
      // const currentDate=new Date();
      // const offset=currentDate.getTimezoneOffset();
      // var finalOffset=minutesToOffsetString(offset);
      // var issueDate=currentDate.toISOString();
    
    //console.log(issuedate); 
    
       const parser = new DOMParser();
       const xml = parser.parseFromString("<PackingList ></PackingList>", "application/xml");
    //   const parser = new DOMParser();
    // const xmlString = '<PackingList xmlns="http://www.smpte-ra.org/schemas/429-8/2007/PKL"></PackingList>';
    //const xml = parser.parseFromString(xmlString, "application/xml");
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
      const issueDatenode=xml.createElement("IssueDate");
      issueDatenode.textContent=issuedate;
      const issuernode=xml.createElement("Issuer");
      issuernode.textContent="Sneha";
      const creatornode=xml.createElement("Creator");
      creatornode.textContent="QubeMaster";
      const filesNode = xml.getElementsByTagName("PackingList")[0];
      filesNode.setAttribute("xmlns", "http://www.smpte-ra.org/schemas/429-8/2007/PKL");
      filesNode.appendChild(directoryuuidNode);
      filesNode.appendChild(AnnotationNode);
      filesNode.appendChild(issueDatenode);
      filesNode.appendChild(issuernode);
      filesNode.appendChild(creatornode);
    
    
     // filesNode.setAttributeNS( "xmlns", "http://example.com/mynamespace");
      const assetListNode = xml.createElement("AssetList");
      // Iterate over each file data object and create a new <Asset> node
      for (let i = 0; i < fileData.length; i++) {
        const file = fileData[i];
        console.log("Type:"+file.type);
        const assetNode = xml.createElement("Asset");
        const nameNode = xml.createElement("AnnotationText");
        nameNode.textContent = file.name;
        const uuidNode = xml.createElement("Id");
        uuidNode.textContent = "urn:uuid:"+file.uuid;
        const hashNode = xml.createElement("Hash");
        hashNode.textContent = file.hash;
        // const pathNode = xml.createElement("Path");
        // pathNode.textContent = file.path;
        const sizeNode = xml.createElement("Size");
        sizeNode.textContent = file.size;
        const typeNode = xml.createElement("Type");
        typeNode.textContent = file.type;

        assetNode.appendChild(uuidNode);
        assetNode.appendChild(nameNode);
        assetNode.appendChild(hashNode);
        assetNode.appendChild(sizeNode);
        assetNode.appendChild(typeNode);
       
        // assetNode.appendChild(pathNode);
        assetListNode.appendChild(assetNode);
      }
      filesNode.appendChild(assetListNode);
      const serializer = new XMLSerializer();
      return serializer.serializeToString(xml);
    }
    
    export default createXml;
    