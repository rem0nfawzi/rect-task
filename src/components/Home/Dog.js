import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const Dog = ({ dog }) => {
  const [age, setAge] = useState(0);
  useEffect(() => {
    let d = parseInt(dog.Birthdate.slice(6, 10));
    setAge(2019 - d);
  }, [dog.Birthdate]);
  return (
    <Link to={`/dog/${dog.ID}`} className='dog list-item'>
      <p>{dog.Name}</p>
      <p>{dog.Race}</p>
      <p>{dog.Color}</p>
      <p>{age}</p>
      <p>{dog.Birthdate.slice(0, 10)}</p>
      <p>{dog.IsDangerous ? 'Dangerous' : 'Not Dangerous'}</p>
    </Link>
  );
};

export default Dog;
