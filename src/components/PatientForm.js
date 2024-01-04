import { useState } from 'react';

export default function PatientForm({ addNewPatient, myDid }) {
    const [patientDetails, setPatientDetails] = useState({
        name: '',
        age: '',
        height: '',
        weight: '',
        bloodGrp: '',
        gender: '',
        did: '',
    });

    const handleChange = (e) => {
        setPatientDetails({ ...patientDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addNewPatient(patientDetails);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" value={patientDetails.name} onChange={handleChange} />
            <input type="number" name="age" placeholder="Age" value={patientDetails.age} onChange={handleChange} />
            <input type="text" name="height" placeholder="Height" value={patientDetails.height} onChange={handleChange} />
            <input type="text" name="weight" placeholder="Weight" value={patientDetails.weight} onChange={handleChange} />
            <input type="text" name="bloodGrp" placeholder="Blood Group" value={patientDetails.bloodGrp} onChange={handleChange} />
            <input type="text" name="gender" placeholder="Gender" value={patientDetails.gender} onChange={handleChange} />
            <input type="text" name="did" placeholder="DID" value={patientDetails.did} onChange={handleChange} />
            <button type="submit">Add Patient</button>
        </form>
    );
}
