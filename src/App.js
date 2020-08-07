import React, { useState,useEffect } from 'react';

import {Select ,MenuItem,FormControl,Card,CardContent} from "@material-ui/core";

import './App.css';
import InfoBox from './InfoBox';

import Table from './Table';

import Map from './Map';

import {sortData} from './util';



import "leaflet/dist/leaflet.css";

import {prettyPrintStat} from "./util";
//https://disease.sh/v3/covid-19/countries-API FOR COUNTRIES

//useeffect - it runs a piece of code based on given condition 
function App() {
{/* useEffect fetch api*/}

const [countries, setCountries] = useState(["India","USA","RUSSIA"]);

const[country,setCountry] = useState('worldwide');

const [countryInfo,setCountryInfo] = useState({});

const[tableData,setTableData] = useState([]);

const[mapCenter,setMapCenter] = useState({lat:34.80746, lng:-40.4796});

const[mapZoom,setMapZoom] = useState(3);

const[mapCountries,setMapCountries] = useState([])

const[casesType,setCasesType] = useState('cases');

 // when the component renders  
useEffect(()=>{

  fetch("https://disease.sh/v3/covid-19/all")
  .then((response)=>response.json())
  .then((data)=>{
    setCountryInfo(data)
  });  
 
},[])
  
useEffect(()=>{
//it accept empty function 
//the code inside her will run once
//when component loads and not again
//we run async ->send a request wait for it do something with that data

const getCountriesData = async()=>{
  await fetch("https://disease.sh/v3/covid-19/countries")
  .then((response) => response.json())
  .then((data)=>{
    const countries = data.map((country)=>(
      {
        name: country.country,  //UnitedStates,India,Australia
        value:country.countryInfo.iso2 //UK,USA
      })); 

      const finalSortedData = sortData(data);
     setTableData(finalSortedData);
      setCountries(countries);
      setMapCountries(data);  //we want all countries objects

  });
};

getCountriesData();
},[countries]);


const onCountryChange = async (event) =>{

  const countryCode = event.target.value;

  setCountry(countryCode);                    
  //https://disease.sh/v3/covid-19/all -if you select worldwide dropdown
  // https://disease.sh/v3/covid-19/countries/[coutry_code] IN - if you select specific contnent
    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then((response)=>response.json())
    .then((data)=>{
    

     

      //All of the data ..
      //from the country response
       
      setCountryInfo(data);

      setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
      setMapZoom(4);

    })

  
  
};



  return (

    <div className="App">
    
         {/*App__left started*/}
      <div className = "app__left">

      <div className="app__header">
    <h1>COVID-19 TRACKER</h1>
      <FormControl className="app__dropdown">
        <Select variant="outlined" value={country} onChange={onCountryChange}>
          {/*i dont want a static values so i want to loop through all values in api countries*/ }

          {/*we use map funtion loop*/ }


          <MenuItem value="worldwide"> WorldWide </MenuItem>
          
       {countries.map((country) => (
       <MenuItem value={country.value}> {country.name} </MenuItem>
       ))}
          
        </Select>
      </FormControl>

      </div>

      

     <div className="app__stats">
       <InfoBox  isRed active ={casesType==="cases"} onClick={e => setCasesType('cases')} title="coronavirus case" cases ={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)} />
       <InfoBox  active ={casesType==="recovered"} onClick={e=> setCasesType('recovered')} title="Recorvered cases"   cases ={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
       <InfoBox isRed active ={casesType==="deaths"} onClick={e => setCasesType('deaths')} title="Death cases" cases ={prettyPrintStat(countryInfo.todayDeaths)} total = {prettyPrintStat(countryInfo.deaths)}/>
       {/*InfoBoxes title="total corona cases for selected country"*/}
        {/*InfoBoxes title="total recovery cases for selected country"*/}
        {/*InfoBoxes title = "total daths for selected country"*/}

     </div>

        <Map  casesType = {casesType} countries ={mapCountries} center={mapCenter} zoom={mapZoom}/>

      </div>  



      {/*App__left ended*/}
      <Card className = "app__right">

        <CardContent>
          <h2>Live cases by country</h2>

          <Table countries={tableData} />           

     
          
  
     </CardContent>
       

      </Card> 





    </div>
  );
}

export default App;
