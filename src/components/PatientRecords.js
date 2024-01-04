import React, { useState, useEffect } from 'react';
import PatientForm from '@/components/PatientForm';
import { createProtocolDefinition } from '@/protocol';
export default function PatientRecords({ web5, myDid }) {
    console.log('this is web5')
    console.log(web5)
    const [patients, setPatients] = useState([]);

    const addNewPatient = async (patientDetails) => {
        const protocolDefinition = await createProtocolDefinition();
        let recipientDID = patientDetails.did;

        const sharedListData = {
            "@type": "list",
            author: myDid,
            name: patientDetails.name,
            age: patientDetails.age,
            height: patientDetails.height,
            weight: patientDetails.weight,
            bloodGrp: patientDetails.bloodGrp,
            recipient: recipientDID,
            gender: patientDetails.gender,
        };

        console.log(sharedListData);
        try {
            const { record, status } = await web5.dwn.records.create({
                data: sharedListData,
                message: {
                    protocol: protocolDefinition.protocol,
                    protocolPath: "list",
                    schema: protocolDefinition.types.list.schema,
                    dataFormat: protocolDefinition.types.list.dataFormats[0],
                    recipient: recipientDID,
                },
            });    
            console.log("Record created", record, status);
            const { status: sendToMeStatus } = await record.send(myDid)
            const { status: sendStatus } = await record.send(recipientDID);
            console.log("Record sent", sendStatus);
            if (sendStatus.code !== 202) {
                console.log("Unable to send to target did:" + sendStatus);
                return;
            } else {
                console.log("Shared list sent to recipient");
            }
        } catch (e) {
            console.error(e);
            return;
        }
    };

    const fetchList = async () => {
        console.log('Fetching list...');
        const protocolDefinition = await createProtocolDefinition();
        try {
            const response = await web5.dwn.records.query({
                from: myDid,    
                message: {
                    filter: {
                        protocol: protocolDefinition.protocol,
                        // schema: protocolDefinition.types.list.schema,
                    },
                },
            });

            if (response.status.code === 200) {
                const patientRecords = await Promise.all(
                    response.records.map(async (record) => {
                        const data = await record.data.json();
                        return {
                            ...data,
                            recordId: record.id
                        };
                    })
                );
                setPatients(patientRecords);
                console.log('Patient records:', patientRecords);
                return patientRecords
            } else {
                console.error('Error fetching list:', response.status);
                return [];
            }

        } catch (error) {
            console.error('Error in fetching list:', error);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div>
            <PatientForm addNewPatient={addNewPatient} myDid={myDid} />
            <div>
                <h2>Patient Records</h2>
                <ul>
                    {patients.map(patient => (
                        <li key={patient.recordId}>
                            Name: {patient.name}, Age: {patient.age}, Gender: {patient.gender}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
