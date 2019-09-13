import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const DogDetails = ({ match, history }) => {
  // state for handling dog info
  const [dog, setDog] = useState({
    ID: '',
    Name: '',
    ColorID: '',
    RaceID: '',
    Birthdate: '',
    ColorName: '',
    RaceName: '',
    IsDangerous: false,
    selectedDate: new Date()
  });
  // Save colors in that const
  const [colors, setColors] = useState([]);
  const [races, setRaces] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const body = JSON.stringify({
          Token: 'token_remon',
          ID: match.params.id
        });
        const res = await axios.post(
          'http://a.payclick.co.il/api/sample/GetAnimalDetails',
          body,
          config
        );
        const tokenBody = JSON.stringify({
          Token: 'token_remon'
        });
        let newColors = await axios.post(
          'http://a.payclick.co.il/api/sample/GetColors',
          tokenBody,
          config
        );
        setColors(newColors.data.Colors);
        const myColor = newColors.data.Colors.filter(color => {
          return color.ID === res.data.AnimalDetails.ColorID;
        });
        let newRaces = await axios.post(
          'http://a.payclick.co.il/api/sample/GetRaces',
          tokenBody,
          config
        );
        setRaces(newRaces.data.Races);
        const myRace = newRaces.data.Races.filter(race => {
          return race.ID === res.data.AnimalDetails.RaceID;
        });
        setDog({
          ...dog,
          Name: res.data.AnimalDetails.Name,
          Birthdate: res.data.AnimalDetails.Birthdate.slice(0, 10),
          ColorID: res.data.AnimalDetails.ColorID,
          RaceID: res.data.AnimalDetails.RaceID,
          ColorName: myColor[0].Name,
          RaceName: myRace[0].Name,
          IsDangerous: res.data.AnimalDetails.IsDangerous,
          ID: res.data.AnimalDetails.ID
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [match.params.id]);

  // Form handling functions
  const handleChange = e => {
    setDog({
      ...dog,
      [e.target.name]: e.target.value
    });
  };
  const handleRadioChange = e => {
    const isDang = e.target.value === 'yes' ? true : false;
    setDog({
      ...dog,
      IsDangerous: isDang
    });
  };

  // Showing and hiding auto complete lists
  const [showColorsList, setColorsList] = useState(false);
  const [showRacesList, setRacesList] = useState(false);
  // Handling Colors
  const chooseColor = (e, id) => {
    setDog({
      ...dog,
      ColorName: e.target.textContent,
      ColorID: id
    });
    setColorsList(false);
  };

  // Handling Races
  const chooseRace = (e, id) => {
    setDog({
      ...dog,
      RaceName: e.target.textContent,
      RaceID: id
    });
    setRacesList(false);
  };

  // Save details
  const [isSaved, setIsSaved] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const handleSubmit = async e => {
    e.preventDefault();
    let animal = {
      Token: 'token_remon',
      ID: dog.ID,
      Name: dog.Name,
      RaceID: dog.RaceID,
      ColorID: dog.ColorID,
      Birthdate: dog.Birthdate,
      IsDangerous: dog.IsDangerous
    };
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const savedAnimal = await axios.post(
      'http://a.payclick.co.il/api/sample/SaveAnimalDetails',
      animal,
      config
    );
    setIsSaved(savedAnimal.data.IsSuccess);
    setErrMsg(savedAnimal.data.ErrorMessage);
    history.push('/');
  };

  // Date
  const handleDate = date => {
    setDog({
      ...dog,
      selectedDate: date,
      Birthdate: moment(date).format('DD/MM/YYYY')
    });
  };
  return (
    <section id='dog-details'>
      <h1>Edit Animal</h1>
      <form id='animal-form' onSubmit={handleSubmit}>
        <div className='input-wrap'>
          <input
            type='text'
            value={dog.Name}
            placeholder='Name*'
            name='Name'
            onChange={handleChange}
          />
        </div>
        <div className='input-wrap auto-comp'>
          <input
            type='text'
            value={dog.ColorName}
            placeholder='Color Name*'
            name='ColorName'
            onChange={handleChange}
            onFocus={() => setColorsList(true)}
          />
          <ul className={`options ${showColorsList ? 'show' : ''}`}>
            {colors.map(color => {
              return color.Name.startsWith(dog.ColorName) ? (
                <li key={color.ID} onClick={e => chooseColor(e, color.ID)}>
                  {color.Name}
                </li>
              ) : null;
            })}
          </ul>
        </div>
        <div className='input-wrap auto-comp'>
          <input
            type='text'
            value={dog.RaceName}
            placeholder='Race Name*'
            name='RaceName'
            onChange={handleChange}
            onFocus={() => setRacesList(true)}
          />
          <ul className={`options ${showRacesList ? 'show' : ''}`}>
            {races.map(race => {
              return race.Name.startsWith(dog.RaceName) ? (
                <li key={race.ID} onClick={e => chooseRace(e, race.ID)}>
                  {race.Name}
                </li>
              ) : null;
            })}
          </ul>
        </div>
        <div className='input-wrap'>
          <input
            type='text'
            value={dog.Birthdate}
            placeholder='BirthDate*'
            name='Birthdate'
            onChange={handleChange}
          />
          <DatePicker
            name='Birthdate'
            selected={dog.selectedDate}
            onChange={handleDate}
            dateFormat='dd, MM , yyy'
          />
        </div>
        <div className='input-wrap'>
          Is Dangerous: Yes
          <input
            type='radio'
            name='IsDangerous'
            value='yes'
            onChange={handleRadioChange}
            checked={dog.IsDangerous}
          />
          No
          <input
            type='radio'
            name='IsDangerous'
            value='no'
            onChange={handleRadioChange}
            checked={!dog.IsDangerous}
          />
        </div>
        <div className='input-wrap'>
          <input type='submit' value='save' />
          <button>cancel</button>
        </div>
      </form>
      <p className='msg'>
        {isSaved && !errMsg ? 'Saved Successfully!' : errMsg}
      </p>
    </section>
  );
};

export default withRouter(DogDetails);
