import { useState, useEffect } from 'react';
import { firestore, storage, auth } from '../firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import Auth from './components/Auth';

const Admin = () => {
  const [car, setCar] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    description: '',
    mileage: '',
    availability: '',
    drive: '',
    engineSize: '',
    fuelType: '',
    horsePower: '',
    transmission: '',
    torque: '',
    acceleration: '',
    images: [], // Store File objects here
  });

  const [originalCar, setOriginalCar] = useState(null); // To keep track of the original data
  const [cars, setCars] = useState([]);
  const [user, setUser] = useState(null);
  const [editingCarId, setEditingCarId] = useState(null);

  useEffect(()=>{
    fetchCars()
  },[])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchCars();
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchCars = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'cars'));
    const carData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setCars(carData);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setCar({ ...car, [name]: files });
    } else {
      setCar({ ...car, [name]: value });
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const imageUrls = [];

  //   for (let i = 0; i < car.images.length; i++) {
  //     const file = car.images[i];
  //     const storageRef = ref(storage, `car-images/${file.name}`);
  //     const snapshot = await uploadBytes(storageRef, file);
  //     const url = await getDownloadURL(snapshot.ref);
  //     imageUrls.push(url);
  //   }

  //   const carData = {
  //     make: car.make,
  //     model: car.model,
  //     year: car.year,
  //     price: car.price,
  //     description: car.description,
  //     mileage: car.mileage,
  //     availability: car.availability,
  //     drive: car.drive,
  //     engineSize: car.engineSize,
  //     fuelType: car.fuelType,
  //     horsePower: car.horsePower,
  //     transmission: car.transmission,
  //     torque: car.torque,
  //     acceleration: car.acceleration,
  //     imageUrls: imageUrls,
  //   };

  //   if (editingCarId) {
  //     await updateDoc(doc(firestore, 'cars', editingCarId), carData);
  //     setEditingCarId(null);
  //   } else {
  //     await addDoc(collection(firestore, 'cars'), carData);
  //   }

  //   alert(editingCarId ? 'Car updated successfully!' : 'Car added successfully!');
  //   setCar({
  //     make: '',
  //     model: '',
  //     year: '',
  //     price: '',
  //     description: '',
  //     mileage: '',
  //     availability: '',
  //     drive: '',
  //     engineSize: '',
  //     fuelType: '',
  //     horsePower: '',
  //     transmission: '',
  //     torque: '',
  //     acceleration: '',
  //     images: [],
  //   });

  //   fetchCars();
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageUrls = [];

    for (let i = 0; i < car.images.length; i++) {
      const file = car.images[i];
      const storageRef = ref(storage, `car-images/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      imageUrls.push(url);
    }

    const carData = {
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      description: car.description,
      mileage: car.mileage,
      availability: car.availability,
      drive: car.drive,
      engineSize: car.engineSize,
      fuelType: car.fuelType,
      horsePower: car.horsePower,
      transmission: car.transmission,
      torque: car.torque,
      acceleration: car.acceleration,
      imageUrls: imageUrls,
    };

    if (editingCarId) {
      await updateDoc(doc(firestore, 'cars', editingCarId), carData);
      setEditingCarId(null);
    } else {
      await addDoc(collection(firestore, 'cars'), carData);
    }

    alert(editingCarId ? 'Car updated successfully!' : 'Car added successfully!');
    setCar({
      make: '',
      model: '',
      year: '',
      price: '',
      description: '',
      mileage: '',
      availability: '',
      drive: '',
      engineSize: '',
      fuelType: '',
      horsePower: '',
      transmission: '',
      torque: '',
      acceleration: '',
      images: [],
    });

    fetchCars();
  };

  const handleEdit = (car) => {
    setCar({
      ...car,
      images: [], // Reset images for editing, to avoid showing URLs as files
    });
    setOriginalCar(car); // Set original data
    setEditingCarId(car.id);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(firestore, 'cars', id));
    fetchCars();
  };

  return (
    <div >
      {/* {!user ? (
        <Auth />
      ) : ( */}
        <div className='w-full'>
          <h1>Admin Panel</h1>
          <div>
              <h2 className="text-2xl font-bold mb-4">Uploaded Cars</h2>
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                 <tr>
                   <th className="py-2 px-4 border-b">Make</th>
                   <th className="py-2 px-4 border-b">Model</th>
                   <th className="py-2 px-4 border-b">Year</th>
                   <th className="py-2 px-4 border-b">Actions</th>
                 </tr>
              </thead>
             <tbody>
              {cars.map((car) => (
                <tr key={car.id} className="text-center">
                  <td className="py-2 px-4 border-b">{car.make}</td>
                  <td className="py-2 px-4 border-b">{car.model}</td>
                  <td className="py-2 px-4 border-b">{car.year}</td>
                 <td className="py-2 px-4 border-b">
                   <button
                    onClick={() => handleEdit(car)}
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-700"
                   >
                    Edit
                  </button>
                  <button
                     onClick={() => handleDelete(car.id)}
                     className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                   >
                    Delete
                  </button>
                 </td>
               </tr>
               ))}
             </tbody>
           </table>
          </div>



            {/* FORM  */}
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <input
              type="text"
              name="make"
              value={car.make}
              onChange={handleChange}
              placeholder="Make"
              required
            />
            <input
              type="text"
              name="model"
              value={car.model}
              onChange={handleChange}
              placeholder="Model"
              required
            />
            <input
              type="number"
              name="year"
              value={car.year}
              onChange={handleChange}
              placeholder="Year"
              required
            />
            <input
              type="number"
              name="price"
              value={car.price}
              onChange={handleChange}
              placeholder="Price"
              required
            />
            <textarea
              name="description"
              value={car.description}
              onChange={handleChange}
              placeholder="Description"
              required
            />
            <input
              type="number"
              name="mileage"
              value={car.mileage}
              onChange={handleChange}
              placeholder="Mileage"
              required
            />
            <input
              type="text"
              name="availability"
              value={car.availability}
              onChange={handleChange}
              placeholder="Availability"
              required
            />
            <select
              name="drive"
              value={car.drive}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Drive</option>
              <option value="4WD">4WD</option>
              <option value="AWD">AWD</option>
              <option value="FWD">FWD</option>
              <option value="RWD">RWD</option>
            </select>
            <input
              type="text"
              name="engineSize"
              value={car.engineSize}
              onChange={handleChange}
              placeholder="Engine Size"
              required
            />
            <select
              name="fuelType"
              value={car.fuelType}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Fuel Type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
            </select>
            <input
              type="number"
              name="horsePower"
              value={car.horsePower}
              onChange={handleChange}
              placeholder="Horse Power"
              required
            />
            <select
              name="transmission"
              value={car.transmission}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Transmission</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
            <input
              type="number"
              name="torque"
              value={car.torque}
              onChange={handleChange}
              placeholder="Torque"
              required
            />
            <input
              type="number"
              name="acceleration"
              value={car.acceleration}
              onChange={handleChange}
              placeholder="Acceleration"
              required
            />
            <input
              type="file"
              name="images"
              multiple
              onChange={handleChange}
              placeholder="Images"
              required
            />
            <button type="submit">{editingCarId ? 'Update Car' : 'Add Car'}</button>
          </form>
    
          {/* <h2>Uploaded Cars</h2>
          <ul>
            {cars.map((car) => (
              <li key={car.id}>
                <h3>{car.make} {car.model} ({car.year})</h3>
                <button onClick={() => handleEdit(car)}>Edit</button>
                <button onClick={() => handleDelete(car.id)}>Delete</button>
              </li>
            ))}
          </ul> */}
        </div>
      {/* )} */}
    </div>
  );
};

export default Admin;



// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { firestore, storage, auth } from '../firebaseConfig';
// import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { onAuthStateChanged } from 'firebase/auth';
// import Auth from './components/Auth';

// const Admin = () => {
//   const [car, setCar] = useState({
//     make: '',
//     model: '',
//     year: '',
//     price: '',
//     description: '',
//     mileage: '',
//     availability: '',
//     drive: '',
//     engineSize: '',
//     fuelType: '',
//     horsePower: '',
//     transmission: '',
//     torque: '',
//     acceleration: '',
//     images: [],
//   });

//   const [originalCar, setOriginalCar] = useState(null); // To keep track of the original data
//   const [cars, setCars] = useState([]);
//   const [user, setUser] = useState(null);
//   const [editingCarId, setEditingCarId] = useState(null);

//   useEffect(()=>{
//     fetchCars()
//   },[])

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUser(user);
//         fetchCars()
//       } else {
//         setUser(null);
//       }
//     });
//     return () => unsubscribe();
//   }, []);


//   const fetchCars = async () => {
//     const querySnapshot = await getDocs(collection(firestore, 'cars'));
//     const carData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
//     setCars(carData);
//   };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'images') {
//       setCar({ ...car, [name]: files });
//     } else {
//       setCar({ ...car, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // if (!user) {
//     //   alert("You need to be signed in to add a car.");
//     //   return;
//     // }

//     const imageUrls = [];

//     for (let i = 0; i < car.images.length; i++) {
//       const file = car.images[i];
//       const storageRef = ref(storage, `car-images/${file.name}`);
//       const snapshot = await uploadBytes(storageRef, file);
//       const url = await getDownloadURL(snapshot.ref);
//       imageUrls.push(url);
//     }

//     await addDoc(collection(firestore, 'cars'), {
//       make: car.make,
//       model: car.model,
//       year: car.year,
//       price: car.price,
//       description: car.description,
//       mileage: car.mileage,
//       availability: car.availability,
//       drive: car.drive,
//       engineSize: car.engineSize,
//       fuelType: car.fuelType,
//       horsePower: car.horsePower,
//       transmission: car.transmission,
//       torque: car.torque,
//       acceleration: car.acceleration,
//       imageUrls: imageUrls,
//     });


//     const carData = {
//       make: car.make,
//       model: car.model,
//       year: car.year,
//       price: car.price,
//       description: car.description,
//       mileage: car.mileage,
//       availability: car.availability,
//       drive: car.drive,
//       engineSize: car.engineSize,
//       fuelType: car.fuelType,
//       horsePower: car.horsePower,
//       transmission: car.transmission,
//       torque: car.torque,
//       acceleration: car.acceleration,
//       imageUrls: imageUrls,
//     };

//     if (editingCarId) {
//       await updateDoc(doc(firestore, 'cars', editingCarId), carData);
//       setEditingCarId(null);
//     } else {
//       await addDoc(collection(firestore, 'cars'), carData);
//     }

//     alert('Car added successfully!');
//     setCar({
//       make: '',
//       model: '',
//       year: '',
//       price: '',
//       description: '',
//       mileage: '',
//       availability: '',
//       drive: '',
//       engineSize: '',
//       fuelType: '',
//       horsePower: '',
//       transmission: '',
//       torque: '',
//       acceleration: '',
//       images: [],
//     });

//     fetchCars()
//   };


//   const handleUpdate = async (e) => {
//     e.preventDefault();

//     // if (!user) {
//     //   alert("You need to be signed in to update a car.");
//     //   return;
//     // }

//     const updatedFields = {};

//     // Compare current car data with original car data
//     for (const key in car) {
//       if (car[key] !== originalCar[key]) {
//         updatedFields[key] = car[key];
//       }
//     }

//     // If images have been changed, handle image upload separately
//     if (car.images !== originalCar.images) {
//       const imageUrls = [];
//       for (let i = 0; i < car.images.length; i++) {
//         const file = car.images[i];
//         const storageRef = ref(storage, `car-images/${file.name}`);
//         const snapshot = await uploadBytes(storageRef, file);
//         const url = await getDownloadURL(snapshot.ref);
//         imageUrls.push(url);
//       }
//       updatedFields.imageUrls = imageUrls;
//     }

//     if (editingCarId && Object.keys(updatedFields).length > 0) {
//       await updateDoc(doc(firestore, 'cars', editingCarId), updatedFields);
//       setEditingCarId(null);
//       alert('Car updated successfully!');
//       setCar({
//         make: '',
//         model: '',
//         year: '',
//         price: '',
//         description: '',
//         mileage: '',
//         availability: '',
//         drive: '',
//         engineSize: '',
//         fuelType: '',
//         horsePower: '',
//         transmission: '',
//         torque: '',
//         acceleration: '',
//         images: [],
//       });
//       fetchCars();
//     }
//   };



//   const handleEdit = (car) => {
//     setCar(car);
//     setOriginalCar(car); // Set original data
//     setEditingCarId(car.id);
//   };

//   const handleDelete = async (id) => {
//     await deleteDoc(doc(firestore, 'cars', id));
//     fetchCars();
//   };

//   return (
//     <div >
//       {/* {!user ? (
//         <Auth />
//       ) : ( */}
//         <div>
//           <h1>Admin Panel</h1>
//           <form onSubmit={editingCarId ? handleUpdate : handleSubmit} style={{display:'flex', flexDirection:'column', gap:'20px'}}>
//             <input
//               type="text"
//               name="make"
//               value={car.make}
//               onChange={handleChange}
//               placeholder="Make"
//               required
//             />
//             <input
//               type="text"
//               name="model"
//               value={car.model}
//               onChange={handleChange}
//               placeholder="Model"
//               required
//             />
//             <input
//               type="number"
//               name="year"
//               value={car.year}
//               onChange={handleChange}
//               placeholder="Year"
//               required
//             />
//             <input
//               type="number"
//               name="price"
//               value={car.price}
//               onChange={handleChange}
//               placeholder="Price"
//               required
//             />
//             <textarea
//               name="description"
//               value={car.description}
//               onChange={handleChange}
//               placeholder="Description"
//               required
//             />
//             <input
//               type="number"
//               name="mileage"
//               value={car.mileage}
//               onChange={handleChange}
//               placeholder="Mileage"
//               required
//             />
//             <input
//               type="text"
//               name="availability"
//               value={car.availability}
//               onChange={handleChange}
//               placeholder="Availability"
//               required
//             />
//            <select
//               name="drive"
//               value={car.drive}
//               onChange={handleChange}
//               required
//             >
//               <option value="" disabled>Select Drive</option>
//               <option value="4WD">4WD</option>
//               <option value="AWD">AWD</option>
//               <option value="FWD">FWD</option>
//               <option value="RWD">RWD</option>
//             </select>
//             <input
//               type="text"
//               name="engineSize"
//               value={car.engineSize}
//               onChange={handleChange}
//               placeholder="Engine Size"
//               required
//             />
//             <select
//               name="fuelType"
//               value={car.fuelType}
//               onChange={handleChange}
//               required
//             >
//               <option value="" disabled>Fuel type</option>
//               <option value="Petrol">Petrol</option>
//               <option value="Diesel">Diesel</option>
//               <option value="Electric">Electric</option>
//             </select>
//             <input
//               type="number"
//               name="horsePower"
//               value={car.horsePower}
//               onChange={handleChange}
//               placeholder="Horse Power"
//               required
//             />
//           <select
//               name="transmission"
//               value={car.transmission}
//               onChange={handleChange}
//               required
//             >
//               <option value="" disabled>Select Transmission</option>
//               <option value="Manual">Manual</option>
//               <option value="Automatic">Automatic</option>
//             </select>
//             <input
//               type="number"
//               name="torque"
//               value={car.torque}
//               onChange={handleChange}
//               placeholder="Torque"
//               required
//             />
//             <input
//               type="number"
//               name="acceleration"
//               value={car.acceleration}
//               onChange={handleChange}
//               placeholder="Acceleration"
//               required
//             />
//             <input
//               type="file"
//               name="images"
//               multiple
//               onChange={handleChange}
//               placeholder="Images"
//               required
//             />
//             <button type="submit">{editingCarId ? 'Update Car' : 'Add Car'}</button>
//           </form>
//           <h2>Uploaded Cars</h2>
//           <ul>
//             {cars.map((car) => (
//               <li key={car.id}>
//                 <h3>{car.make} {car.model} ({car.year})</h3>
//                 <button onClick={() => handleEdit(car)}>Edit</button>
//                 <button onClick={() => handleDelete(car.id)}>Delete</button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       {/* )} */}
//     </div>
//   );
// };

// export default Admin;










// const Admin = () => {
//   const [car, setCar] = useState({
//     make: '',
//     model: '',
//     year: '',
//     price: '',
//     description: '',
//     images: [],
//   });
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUser(user);
//       } else {
//         setUser(null);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'images') {
//       setCar({ ...car, [name]: files });
//     } else {
//       setCar({ ...car, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // if (!user) {
//     //   alert("You need to be signed in to add a car.");
//     //   return;
//     // }

//     const imageUrls = [];

//     for (let i = 0; i < car.images.length; i++) {
//       const file = car.images[i];
//       const storageRef = ref(storage, `car-images/${file.name}`);
//       const snapshot = await uploadBytes(storageRef, file);
//       const url = await getDownloadURL(snapshot.ref);
//       imageUrls.push(url);
//     }

//     await addDoc(collection(firestore, 'cars'), {
//       make: car.make,
//       model: car.model,
//       year: car.year,
//       price: car.price,
//       description: car.description,
//       imageUrls: imageUrls,
//     });

//     alert('Car added successfully!');
//     setCar({
//       make: '',
//       model: '',
//       year: '',
//       price: '',
//       description: '',
//       images: [],
//     });
//   };

//   return (
//     <div>
//       {/* {!user ? (
//         <Auth />
//       ) : ( */}
//         <div>
//           <h1>Admin Panel</h1>
//           <form onSubmit={handleSubmit}>
//             <input
//               type="text"
//               name="make"
//               value={car.make}
//               onChange={handleChange}
//               placeholder="Make"
//               required
//             />
//             <input
//               type="text"
//               name="model"
//               value={car.model}
//               onChange={handleChange}
//               placeholder="Model"
//               required
//             />
//             <input
//               type="number"
//               name="year"
//               value={car.year}
//               onChange={handleChange}
//               placeholder="Year"
//               required
//             />
//             <input
//               type="number"
//               name="price"
//               value={car.price}
//               onChange={handleChange}
//               placeholder="Price"
//               required
//             />
//             <textarea
//               name="description"
//               value={car.description}
//               onChange={handleChange}
//               placeholder="Description"
//               required
//             />
//             <input
//               type="file"
//               name="images"
//               multiple
//               onChange={handleChange}
//               placeholder="Images"
//               required
//             />
//             <button type="submit">Add Car</button>
//           </form>
//         </div>
//       {/* )} */}
//     </div>
//   );
// };

//export default Admin;