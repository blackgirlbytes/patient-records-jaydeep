import { useState, useEffect } from 'react';
import { createProtocolDefinition, queryProtocol, installProtocol } from '@/protocol';
import { Web5 } from '@web5/api';
import PatientRecords from '@/components/PatientRecords';

export default function Home() {
  const [web5, setWeb5] = useState(null);
  const [myDid, setMyDid] = useState(null);
  const [protocolInstalled, setProtocolInstalled] = useState(false);
  const [isWeb5Initializing, setIsWeb5Initializing] = useState(true);
  const [protocolStatus, setProtocolStatus] = useState(null);

  useEffect(() => {
    async function initWeb5() {
      try {
        const { web5, did } = await Web5.connect();
        setWeb5(web5);
        setMyDid(did);
        setIsWeb5Initializing(false);
      } catch (error) {
        console.error("Error initializing Web5:", error);
      }
    }
    initWeb5();
  }, []);

  async function checkIfProtocolExists(web5) {
    const { protocols, status } = await queryProtocol(web5);
    console.log(protocols, status)
    return status.code === 200 && protocols.length > 0;
  }

  async function configureProtocol() {
    if (!web5) {
      console.error("Web5 is not initialized");
      return;
    }

    try {
      console.log("Creating protocol definition...")
      const protocolDefinition = await createProtocolDefinition();
      console.log(protocolDefinition)
      const protocolExists = await checkIfProtocolExists(web5);

      if (!protocolExists) {
        const test = await installProtocol(web5, protocolDefinition, myDid);
        console.log(test)
        console.log("Protocol installed and configured successfully.");
        setProtocolInstalled(true);
        setProtocolStatus("Protocol installed and configured successfully.");
      } else {
        console.log("Protocol already installed.");
        setProtocolStatus("Protocol already installed.");
        setProtocolInstalled(true);
      }
    } catch (error) {
      console.error("Error configuring protocol:", error);
      setProtocolStatus("Error configuring protocol.");
    }
  }

  if (isWeb5Initializing) {
    return <div>Loading Web5, please wait...</div>;
  }

  const handleCopyDid = () => {
    navigator.clipboard.writeText(myDid);
    console.log(myDid);
    // alert("DID copied to clipboard");
  };
  return (
    <div>
      <h2>To use this application, install the protocol</h2>
      <button onClick={configureProtocol}>Install Protocol</button>
      {protocolInstalled && (
        <>
          <p>{protocolStatus}</p>
          <button onClick={handleCopyDid}>Copy DID</button>
          <PatientRecords myDid={myDid} web5={web5} />

        </>
      )}
    </div>
  );
}
