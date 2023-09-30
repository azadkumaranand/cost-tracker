import React, { useState, useEffect, useMemo } from "react";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, } from "firebase/firestore";
import { db } from "./Firebase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import Loader from "./Loader";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Button
} from '@chakra-ui/react'


function Home() {
  const date = new Date();
  // console.log(date.getDay(), date.getMonth(), date.getFullYear(), date.getDate());
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const dateString = `${month}/${date.getDate()}/${date.getFullYear()}`;
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [allTask, setAllTask] = useState([]);
  
  const [updateName, setUpodateName] = useState("");
  const [updateAmount, setUpodateAmount] = useState("");
  const [loader, setLoader] = useState(false);


  //fetch saved task from database

  const listOfTask = useMemo(async () => {
    const taskList = [];
    setLoader(true);
    const querySnapshot = await getDocs(collection(db, "CostsDetails"));
    querySnapshot.docs.forEach((doc) => {
      taskList.push({ ...doc.data(), id: doc.id });
    });
    setLoader(false);
    setAllTask(taskList);
    return taskList;
  }, []);
  // console.log(allTask)
  // console.log(Array.isArray(allTask))

  useEffect(() => {}, [listOfTask]);

  const [selectedDate, setSelectedDate] = React.useState(null);
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  //filter task by date
  let TotalAmount = 0;
  let TotalMonthAmount = 0;
  let totalAmountOfSelectedMonth = 0;
  let selectedMonth = "";
  const filterTask =
    Array.isArray(allTask) && allTask.length > 0
      ? allTask.filter((item) => {
          const CurrentDate = new Date();
          const currentDateString = CurrentDate.toLocaleDateString().slice(
            0,
            1
          );

          const thisMonthInvestment =
            item.date.slice(0, 1) === currentDateString;
          const itemAmount = parseInt(item.amount);
          TotalAmount += itemAmount;
          if (thisMonthInvestment) {
            TotalMonthAmount += parseInt(item.amount);
          }
          if (selectedDate) {
            selectedMonth = selectedDate.toLocaleDateString().slice(0, 1);
            const selectedMonthInvestment =
              item.date.slice(0, 1) === selectedMonth;
            if (selectedMonthInvestment) {
              totalAmountOfSelectedMonth += parseInt(item.amount);
            }
            const filtterByDate =
              selectedDate.toLocaleDateString() === item.date;
            return filtterByDate;
          }

          return thisMonthInvestment;
        }).sort((a, b) => {
          // Convert date strings to Date objects for comparison
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);

          // Compare the dates
          return dateA - dateB;
        })
      : [];

  //add task to database
  const addTask = async () => {
    if (name === "" || amount === "") {
      alert("Fill Name and Amount");
      return;
    }
    console.log(name, amount, dateString);
    setLoader(true);
    await addDoc(collection(db, "CostsDetails"), {
      name: name,
      amount: amount,
      date: dateString,
      month: month,
      year: year,
      rented: true,
    });
    setLoader(false);
    // setName("");
    // setAmount("");
    window.location.reload();
    alert("Data saved");
  };

  //modal
  const OverlayTwo = () => (
    <ModalOverlay
      bg='none'
      backdropFilter='auto'
      backdropInvert='80%'
      backdropBlur='2px'
    />
  )
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [overlay, setOverlay] = React.useState(<OverlayTwo />)

  const [notEditable, setNotEditable] = useState(true);

  //edit task
  const editTask = (name, amount) => {
    setUpodateName(name);
    setUpodateAmount(amount)
    setNotEditable(false);
  }

  //update task
  const updateTask = async (id) => {
    const washingtonRef = doc(db, "CostsDetails", id);
    setLoader(true);
    await updateDoc(washingtonRef, {
      name: updateName,
      amount: updateAmount,
    });
    window.location.reload();
    setLoader(false);
    setNotEditable(true);
  }

  //delete task
  const [deleteId, setDeleteId] = useState("");
  const deleteTask = (id) => {
    setOverlay(<OverlayTwo />)
    onOpen()
    setDeleteId(id);
  }

  const confDeleteTask = async () => {
    const docRef = doc(db, "CostsDetails", deleteId);
    onClose();
    setLoader(true);
    await deleteDoc(docRef);
    setLoader(false);
    window.location.reload();
  }

  return (
    <>
    {loader && <Loader/>}
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>Delete This</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are You Sure?</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={confDeleteTask} className="bg-danger text-white">Yes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    <div className="container">
      <h1 className="h1 text-center">Add Your Investment</h1>
      <div className="inputContainer">
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="name" className="form-label h5">
                Liability
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label h5">
                Invested Amount
              </label>
              <input
                type="number"
                className="form-control"
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <button className="btn btn-success" onClick={addTask}>
          Add
        </button>
      </div>
      {/* <h1 className="h3 text-center my-3">Track Your Investment</h1> */}

      <div className="listedTask my-3">
        <p className="h4">
          Invested{" "}
          <span className="text-success">
            Rs: {selectedDate ? totalAmountOfSelectedMonth : TotalMonthAmount}
          </span>{" "}
          Amount in this{" "}
          <span className="text-success">
            {selectedDate ? selectedMonth : month}th
          </span>{" "}
          month
        </p>
        <div className="my-3">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MM/dd/yyyy"
            isClearable
            placeholderText="Select a date"
            customInput={
              <BsFillCalendar2DateFill
                style={{
                  fontSize: "45px",
                  cursor: "pointer",
                  color: "#fc0384",
                  marginRight: "10px",
                }}
              />
            }
          />
          {selectedDate && (
            <span
              style={{
                fontSize: "18px",
                color: "#fc0384",
                fontWeight: "500",
              }}
            >
              {selectedDate.toLocaleDateString()}
            </span>
          )}
        </div>
        {filterTask.length > 0
          ? filterTask.map((item, index) => {
              return (
                <>
                  <div
                    className="row"
                    key={index}
                    style={{
                      backgroundColor: "#9098a6",
                      margin: "10px 0",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "2px 2px 5px #555755",
                    }}
                  >
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label
                          htmlFor="name"
                          className="form-label h6 text-white"
                        >
                          Liability
                        </label><span className="h6 text-white bg-success rounded-2 mx-3 px-2">{`${(item.date).split("/")[1]}/${(item.date).split("/")[0]}/${(item.date).split("/")[2]}`}</span>
                        <input
                          type="text"
                          className="form-control"
                          value={notEditable ? item.name : updateName}
                          onChange={(e)=>{setUpodateName(e.target.value)}}
                          disabled = {notEditable}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 text-white">
                      <div className="mb-3">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label h6"
                        >
                          Amount
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={notEditable ? item.amount : updateAmount}
                          onChange={(e)=>{setUpodateAmount(e.target.value)}}
                          disabled = {notEditable}
                        />
                      </div>
                    </div>
                    <div>
                      <button className="btn btn-warning mx-3" onClick={()=>{notEditable? editTask(item.name, item.amount) : updateTask(item.id)}}>{notEditable?"Edit":"Update"}</button>
                      <button className="btn btn-danger" onClick={()=>{deleteTask(item.id)}}>Delete</button>
                    </div>
                  </div>
                </>
              );
            })
          : selectedDate
          ? "Not Found"
          : "Loading..."}
      </div>
    </div>
    </>
  );
}

export default Home;
