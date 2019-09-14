import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import Autocomplete from 'react-autocomplete';

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
    IsDangerous: false
  });

  // State for colors and Races
  const [colorsNames, setColorsNames] = useState([]);
  const [racesNames, setRacesNames] = useState([]);

  useEffect(() => {
    // Fetching data
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
        setColorsNames(
          newColors.data.Colors.map(c => {
            return { label: c.Name, id: c.ID };
          })
        );
        const myColor = newColors.data.Colors.filter(color => {
          return color.ID === res.data.AnimalDetails.ColorID;
        });
        let newRaces = await axios.post(
          'http://a.payclick.co.il/api/sample/GetRaces',
          tokenBody,
          config
        );
        setRacesNames(
          newRaces.data.Races.map(c => {
            return { label: c.Name, id: c.ID };
          })
        );
        const myRace = newRaces.data.Races.filter(race => {
          return race.ID === res.data.AnimalDetails.RaceID;
        });
        let d =
          res.data.AnimalDetails.Birthdate.slice(3, 5) +
          ' ' +
          res.data.AnimalDetails.Birthdate.slice(0, 2) +
          ' ' +
          res.data.AnimalDetails.Birthdate.slice(6, 10);
        setDog({
          Name: res.data.AnimalDetails.Name,
          Birthdate: res.data.AnimalDetails.Birthdate.slice(0, 10),
          ColorID: res.data.AnimalDetails.ColorID,
          RaceID: res.data.AnimalDetails.RaceID,
          ColorName: myColor[0].Name,
          RaceName: myRace[0].Name,
          IsDangerous: res.data.AnimalDetails.IsDangerous,
          ID: res.data.AnimalDetails.ID,
          selectedDate: new Date(d)
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

  // Save details
  const [errMsg, setErrMsg] = useState(null);
  // Save details
  const handleSubmit = async e => {
    e.preventDefault();
    let r = racesNames.filter(r => {
      return r.label === dog.RaceName;
    })[0].id;
    let c = colorsNames.filter(r => {
      return r.label === dog.ColorName;
    })[0].id;
    let animal = {
      Token: 'token_remon',
      ID: dog.ID,
      Name: dog.Name,
      RaceID: r,
      ColorID: c,
      Birthdate: dog.Birthdate,
      IsDangerous: dog.IsDangerous
    };
    console.log(animal);
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
    setErrMsg(savedAnimal.data.ErrorMessage);
    console.log(savedAnimal.data.IsSuccess);
    if (savedAnimal.data.IsSuccess) {
      history.push('/');
    } else {
      setErrMsg('Not Saved');
    }
  };

  // Date
  const handleDate = date => {
    setDog({
      ...dog,
      selectedDate: date,
      Birthdate: moment(date).format('DD/MM/YYYY')
    });
  };

  const customStyle = {
    zIndex: 5,
    maxHeight: '100px',
    bottom: 0,
    border: '1px solid #eee',
    overflowY: 'scroll'
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
        <div className='input-wrap'>
          <Autocomplete
            getItemValue={item => item.label}
            items={colorsNames}
            shouldItemRender={(item, value) =>
              item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
            }
            renderItem={(item, highlighted) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: highlighted ? '#eee' : 'transparent'
                }}
              >
                {item.label}
              </div>
            )}
            value={dog.ColorName}
            onChange={e => {
              setDog({ ...dog, ColorName: e.target.value });
            }}
            onSelect={val => setDog({ ...dog, ColorName: val })}
            menuStyle={customStyle}
          />
        </div>

        {/* Races */}
        <div className='input-wrap'>
          <Autocomplete
            getItemValue={item => item.label}
            items={racesNames}
            shouldItemRender={(item, value) =>
              item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
            }
            renderItem={(item, highlighted) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: highlighted ? '#eee' : 'transparent'
                }}
              >
                {item.label}
              </div>
            )}
            value={dog.RaceName}
            onChange={e => setDog({ ...dog, RaceName: e.target.value })}
            onSelect={val => setDog({ ...dog, RaceName: val })}
            menuStyle={customStyle}
          />
        </div>

        <div className='input-wrap'>
          {dog.selectedDate ? (
            <DatePicker
              name='Birthdate'
              selected={dog.selectedDate}
              onChange={handleDate}
              dateFormat='dd/MM/yyy'
            />
          ) : null}
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

      {errMsg !== null && <p className='err-msg show'>errMsg</p>}
    </section>
  );
};

export default withRouter(DogDetails);
