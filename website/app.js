/* Global Variables */

// const { promises } = require("fs");

// const { response } = require("express");
const baseURL = "http://api.openweathermap.org/data/2.5/forecast?units=metric&zip=";
const apiKey = "&appid=5a5b15f053d3566afa9ed965f27cb656";


// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

const postData = async (url = "", data = {}) => {
    const res = await fetch(url, {
        method: 'POST', 
        credentials: 'same-origin', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
}


const getData = async (url) => {
    
    const res = await fetch(url);
    try{
        const newData = await res.json();
        return new Promise((resolve, reject) => {
            
            resolve(newData);
        });
    }
    catch(error){
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
    
}

document.getElementById("generate").addEventListener("click", async (evt) => {
    evt.preventDefault();
    const zip = document.getElementById("zip").value;
    if (zip){
        getData(baseURL + zip + apiKey).then(async (res) => {    
            
            if (res.cod === "200"){
                postData("/add", {
                    temperature: res.list[0].main.temp,
                    date: newDate,
                    response: document.getElementById("feelings").value
                });
                return new Promise((resolve, reject) => { resolve("success"); });
            }
            return new Promise((resolve, reject) => { reject(new Error("city not found!")); });
        }).then(async (msg) => {
            getData("/retrieve").then((res) => {
                document.getElementById("temp").textContent = "Temperature: " + res.temperature + " degrees celsius";
                document.getElementById("date").textContent = "Date: " + res.date;
                document.getElementById("content").textContent = "i am feeling: " + res.response;
            });
        }, (reason) => { 
            printError(reason);
        });
    }
    else {
        printError("you need to provide a zip code");
    }
});

const printError = (msg) => {
    document.getElementById("date").textContent = msg;
    document.getElementById("temp").textContent = "";
    document.getElementById("content").textContent = "";
}