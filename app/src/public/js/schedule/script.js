scheduleMain();

document.addEventListener("DOMContentLoaded", function () {
  scheduleMain();
});

function scheduleMain() {
  const DEFAULT_OPTION = "Select category";

  let categoryInput,
    startDateInput,
    endDateInput,
    allDayCheckbox,
    startTimeInput,
    endTimeInput,
    teacherCheckbox,
    memoInput,
    addButton,
    scheduleList = [],
    calendar,
    // shortlistBtn,
    scheduleTable,
    draggingElement;

  getElements();
  addListeners();
  initCalendar();
  load();
  // renderRows(scheduleList);

  function getElements() {
    categoryInput = document.getElementById("categoryInput");
    memoInput = document.getElementById("memoInput");
    startDateInput = document.getElementById("startDateInput");
    endDateInput = document.getElementById("endDateInput");
    allDayCheckbox = document.getElementById("allDayCheckbox");
    startTimeInput = document.getElementById("startTimeInput");
    endTimeInput = document.getElementById("endTimeInput");
    teacherCheckbox = document.getElementById("teacherCheckbox");
    addButton = document.getElementById("addBtn");
    // shortlistBtn = document.getElementById("shortlistBtn");
    scheduleTable = document.getElementById("scheduleTable");
  }

  function addListeners() {
    addButton.addEventListener("click", addEntry, false);
    // shortlistBtn.addEventListener("change", multipleFilter, false);
    scheduleTable.addEventListener("dragstart", onDragstart, false);
    scheduleTable.addEventListener("drop", onDrop, false);
    scheduleTable.addEventListener("dragover", onDragover, false);
  }

  function addEntry(event) {
    let categoryValue = categoryInput.value;
    categoryInput.value = "";

    let startDateValue = startDateInput.value;
    startDateInput.value = "";

    let endDateValue = endDateInput.value;
    endDateInput.value = "";

    let allDayValue = allDayCheckbox.checked;
    allDayCheckbox.checked = false;

    let startTimeValue = allDayValue ? "" : startTimeInput.value;
    startTimeInput.value = "";

    let endTimeValue = allDayValue ? "" : endTimeInput.value;
    endTimeInput.value = "";

    let teacherValue = [];
    let teacherCheckbox = document.querySelectorAll(".teacherCheckbox");
    teacherCheckbox.forEach((checkbox) => {
      if (checkbox.checked) {
        teacherValue.push(checkbox.value);
      }
    });
    teacherCheckbox.forEach((checkbox) => {
      checkbox.checked = false;
    });

    let memoValue = memoInput.value;
    memoInput.value = "";

    let obj = {
      id: _uuid(),
      category: categoryValue,
      startDate: startDateValue,
      endDate: endDateValue,
      allDay: allDayValue,
      startTime: startTimeValue,
      endTime: endTimeValue,
      teacher: teacherValue.join(", "),
      memo: memoValue,
      done: false,
    };

    renderRow(obj);
    scheduleList.push(obj);
    save();
    addEvent(obj);
    calendar.render();
  }

  function save() {
    let stringified = JSON.stringify(scheduleList);
    localStorage.setItem("scheduleList", stringified);
  }

  function renderRows(list) {
    clearTable();
    calendar.getEvents().forEach((e) => e.remove()); // ✅ 추가
    list.forEach(renderRow);
  }

  function load() {
    let retrieved = localStorage.getItem("scheduleList");
    scheduleList = JSON.parse(retrieved);
    if (scheduleList == null) scheduleList = [];
  }

  function renderRow({
    category,
    id,
    startDate,
    endDate,
    allDay,
    startTime,
    endTime,
    teacher,
    memo,
    done,
  }) {
    // 날짜 포맷 함수
    function formatDate(dateStr) {
      if (!dateStr) return "";
      try {
        return new Date(dateStr).toISOString().split("T")[0];
      } catch (e) {
        return dateStr;
      }
    }

    // add a new row
    let trElem = document.createElement("tr");
    scheduleTable.appendChild(trElem);
    trElem.draggable = "true";
    trElem.dataset.id = id;

    // checkbox cell
    let checkboxElem = document.createElement("input");
    checkboxElem.type = "checkbox";
    checkboxElem.dataset.id = id;
    checkboxElem.addEventListener("click", checkboxClickCallback, false);

    let tdElem1 = document.createElement("td");
    tdElem1.appendChild(checkboxElem);
    trElem.appendChild(tdElem1);

    // ✅ 날짜 포맷 적용
    let formattedStart = formatDate(startDate);
    let formattedEnd = formatDate(endDate);

    let dateElem = document.createElement("td");
    dateElem.innerText = `${formattedStart} ~ ${formattedEnd}`;
    trElem.appendChild(dateElem);
    dateElem.addEventListener("click", () => {
      calendar.gotoDate(formattedStart); // 🔥 수정 포인트!
    });

    // time cell
    let timeElem = document.createElement("td");
    timeElem.innerText = allDay
      ? "All-day"
      : `${startTime || "00:00"} ~ ${endTime || "23:59"}`;
    trElem.appendChild(timeElem);

    // category cell
    let categoryElem = document.createElement("td");
    categoryElem.innerText = category;
    trElem.appendChild(categoryElem);

    // teacher cell
    let teacherElem = document.createElement("td");
    teacherElem.innerText = teacher;
    trElem.appendChild(teacherElem);

    // memo cell
    let memoElem = document.createElement("td");
    memoElem.innerText = memo;
    trElem.appendChild(memoElem);

    // edit cell
    let editSpan = document.createElement("span");
    editSpan.innerText = "edit";
    editSpan.className = "material-icons";
    editSpan.dataset.id = id;
    let editTd = document.createElement("td");
    editTd.appendChild(editSpan);
    trElem.appendChild(editTd);

    // delete cell
    let spanElem = document.createElement("span");
    spanElem.innerText = "delete";
    spanElem.className = "material-icons";
    spanElem.addEventListener("click", deleteItem, false);
    spanElem.dataset.id = id;
    let tdElem3 = document.createElement("td");
    tdElem3.appendChild(spanElem);
    trElem.appendChild(tdElem3);

    // done button
    checkboxElem.type = "checkbox";
    checkboxElem.checked = done;
    if (done) {
      trElem.classList.add("strike");
    } else {
      trElem.classList.remove("strike");
    }

    dateElem.dataset.type = "date";
    timeElem.dataset.type = "time";
    categoryElem.dataset.type = "category";
    teacherElem.dataset.type = "teacher";
    memoElem.dataset.type = "memo";

    dateElem.dataset.id = id;
    timeElem.dataset.id = id;
    categoryElem.dataset.id = id;
    teacherElem.dataset.id = id;
    memoElem.dataset.id = id;

    function deleteItem() {
      const isConfirmed = confirm(
        "Confirm: do you want to delete this schedule?"
      );
      if (!isConfirmed) {
        return;
      }

      trElem.remove();
      // updateSelectOptions();

      for (let i = 0; i < scheduleList.length; i++) {
        if (scheduleList[i].id == this.dataset.id) scheduleList.splice(i, 1);
      }
      save();

      // remove from calendar
      let calendarEvent = calendar.getEventById(this.dataset.id);
      if (calendarEvent !== null) calendarEvent.remove();
    }

    function checkboxClickCallback() {
      trElem.classList.toggle("strike");
      for (let i = 0; i < scheduleList.length; i++) {
        if (scheduleList[i].id == this.dataset.id)
          scheduleList[i]["done"] = this.checked;
      }
      save();
      multipleFilter();
    }
  }

  function _uuid() {
    var d = Date.now();
    if (
      typeof performance !== "undefined" &&
      typeof performance.now === "function"
    ) {
      d += performance.now(); //use high-precision timer if available
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }

  function initCalendar() {
    var calendarEl = document.getElementById("calendar");
    if (!calendarEl) {
      console.error("Calendar element not found");
      return;
    }

    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      initialDate: new Date(), //'2020-07-07',
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      events: [],
      eventClick: function (info) {
        toEditItem(info.event);
      },
      eventBackgroundColor: "#0050bd",
      eventBorderColor: "#ddd",
      editable: true,
      eventDrop: function (info) {
        calendarEventDragged(info.event);
      },
      eventTimeFormat: {
        hour: "numeric",
        minute: "2-digit",
        omitZeroMinute: false,
        hour12: false,
      },
      slotMinTime: "09:00:00",
      slotMaxTime: "19:00:00",
    });

    calendar.render();
  }

  // function addEvent({
  //   id,
  //   category,
  //   startDate,
  //   endDate,
  //   startTime,
  //   endTime,
  //   allDay,
  //   done,
  // }) {
  //   // start는 최소한 날짜는 반드시 있어야 함
  //   if (!startDate) return;

  //   calendar.addEvent({
  //     id: id,
  //     title: category,
  //     start: allDay ? startDate : `${startDate}T${startTime}`,
  //     end: allDay ? endDate : `${endDate}T${endTime}`,
  //     allDay: allDay,
  //     backgroundColor: done ? "#ddd" : "#89d0f8",
  //   });
  // }
  function addEvent({
    id,
    category,
    startDate,
    endDate,
    startTime,
    endTime,
    allDay,
    done,
  }) {
    if (!startDate) {
      console.error("No start date provided for event:", id);
      return;
    }

    const start = allDay ? startDate : `${startDate}T${startTime || "00:00"}`;
    const end = endDate
      ? allDay
        ? endDate
        : `${endDate}T${endTime || "23:59"}`
      : null;

    console.log("Adding event:", { id, start, end, allDay }); // 디버깅용

    try {
      calendar.addEvent({
        id: id,
        title: category || "No category",
        start: start,
        end: end,
        allDay: allDay,
        backgroundColor: done ? "#ddd" : "#89d0f8",
      });
    } catch (error) {
      console.error("Failed to add event to calendar:", error);
    }
  }

  function clearTable() {
    // Empty the table, keeping the first row
    let trElems = scheduleTable.getElementsByTagName("tr");
    for (let i = trElems.length - 1; i > 0; i--) {
      trElems[i].remove();
    }

    calendar.getEvents().forEach((event) => event.remove());
  }

  // function multipleFilter() {
  //   clearTable();

  //   // let selection = selectElem.value;
  //   if (shortlistBtn.checked) {
  //     let resultArray = [];

  //     let filteredIncompleteArray = scheduleList.filter(
  //       (obj) => obj.done == false
  //     );
  //     //renderRows(filteredIncompleteArray);

  //     let filteredDoneArray = scheduleList.filter((obj) => obj.done == true);
  //     //renderRows(filteredDoneArray);

  //     resultArray = [...filteredIncompleteArray, ...filteredDoneArray];
  //     renderRows(resultArray);
  //   } else {
  //     renderRows(scheduleList);
  //   }
  // }

  function onTableClicked(event) {
    if (event.target.matches("td") && event.target.dataset.editable == "true") {
      let tempInputElem;
      switch (event.target.dataset.type) {
        case "date":
          tempInputElem = document.createElement("input");
          tempInputElem.type = "date";
          tempInputElem.value = event.target.dataset.value;
          break;
        case "time":
          tempInputElem = document.createElement("input");
          tempInputElem.type = "time";
          tempInputElem.value = event.target.innerText;
          break;
        case "category":
          tempInputElem = document.createElement("input");
          tempInputElem.value = event.target.innerText;
          break;
        case "teacher":
          tempInputElem = document.createElement("input");
          tempInputElem.value = event.target.innerText;
          break;
        case "memo":
          tempInputElem = document.createElement("input");
          tempInputElem.value = event.target.innerText;
          break;
        default:
      }
      event.target.innerText = "";
      event.target.appendChild(tempInputElem);

      tempInputElem.addEventListener("change", onChange, false);
    }

    function onChange(event) {
      let changedValue = event.target.value;
      let id = event.target.parentNode.dataset.id;
      let type = event.target.parentNode.dataset.type;

      // remove from calendar
      calendar.getEventById(id).remove();

      scheduleList.forEach((scheduleObj) => {
        if (scheduleObj.id == id) {
          //scheduleObj.schedule = changedValue;
          scheduleObj[type] = changedValue;

          addEvent({
            id: id,
            title: scheduleObj.category,
            start: scheduleObj.date,
            end: scheduleObj.date,
          });
        }
      });
      save();

      if (type == "date") {
        event.target.parentNode.innerText = formatDate(changedValue);
      } else {
        event.target.parentNode.innerText = changedValue;
      }
    }
  }

  function formatDate(dateStr) {
    if (!dateStr || dateStr.length < 10) return "";
    try {
      return new Date(dateStr).toISOString().split("T")[0];
    } catch (e) {
      return dateStr;
    }
  }

  function onDragstart(event) {
    draggingElement = event.target; //trElem
  }

  function onDrop(event) {
    /* Handling visual drag and drop of the rows */

    // prevent when target is table
    if (event.target.matches("table")) return;

    let beforeTarget = event.target;

    // to look through parent until it is tr
    while (!beforeTarget.matches("tr")) beforeTarget = beforeTarget.parentNode;

    // to be implemented
    //beforeTarget.style.paddingTop = "1rem";

    // prevent when the tr is the first row
    if (beforeTarget.matches(":first-child")) return;

    // visualise the drag and drop
    scheduleTable.insertBefore(draggingElement, beforeTarget);

    /* Handling the array */

    let tempIndex;

    // find the index of one to be taken out
    scheduleList.forEach((scheduleObj, index) => {
      if (scheduleObj.id == draggingElement.dataset.id) tempIndex = index;
    });

    // pop the element
    let [toInsertObj] = scheduleList.splice(tempIndex, 1);

    // find the index of one to be inserted before

    scheduleList.forEach((scheduleObj, index) => {
      if (scheduleObj.id == beforeTarget.dataset.id) tempIndex = index;
    });

    // insert the temp
    scheduleList.splice(tempIndex, 0, toInsertObj);

    // update storage
    save();
  }

  function onDragover(event) {
    event.preventDefault();
  }

  // function calendarEventDragged(event) {
  //   let id = event.id;
  //   //console.log(`event.start : ${event.start}`);
  //   let dateObj = new Date(event.start);
  //   //console.log(`dateObj : ${dateObj}`);
  //   let year = dateObj.getFullYear();
  //   let month = dateObj.getMonth() + 1;
  //   let date = dateObj.getDate();
  //   let hour = dateObj.getHours();
  //   let minute = dateObj.getMinutes();
  //   //console.log(`time: ${hour}:${minute}`);

  //   let paddedMonth = month.toString();
  //   if (paddedMonth.length < 2) {
  //     paddedMonth = "0" + paddedMonth;
  //   }

  //   let paddedDate = date.toString();
  //   if (paddedDate.length < 2) {
  //     paddedDate = "0" + paddedDate;
  //   }

  //   let toStoreDate = `${year}-${paddedMonth}-${paddedDate}`;
  //   console.log(toStoreDate);

  //   scheduleList.forEach((scheduleObj) => {
  //     if (scheduleObj.id == id) {
  //       scheduleObj.date = toStoreDate;
  //       if (hour !== 0)
  //         scheduleObj.time = `${hour.toString().padStart(2, "0")}:${minute
  //           .toString()
  //           .padStart(2, "0")}`;
  //     }
  //   });

  //   save();

  //   multipleFilter();
  // }
  function calendarEventDragged(event) {
    let id = event.id;
    let dateObj = new Date(event.start);
    let year = dateObj.getFullYear();
    let month = String(dateObj.getMonth() + 1).padStart(2, "0");
    let date = String(dateObj.getDate()).padStart(2, "0");
    let toStoreDate = `${year}-${month}-${date}`;

    scheduleList.forEach((scheduleObj) => {
      if (scheduleObj.id === id) {
        scheduleObj.startDate = toStoreDate; // 속성 이름 일치
        if (!scheduleObj.allDay) {
          let hour = String(dateObj.getHours()).padStart(2, "0");
          let minute = String(dateObj.getMinutes()).padStart(2, "0");
          scheduleObj.startTime = `${hour}:${minute}`;
        }
      }
    });
    save();
    multipleFilter();
  }
}
