scheduleMain();

function scheduleMain() {
  const DEFAULT_OPTION = "Choose category";

  let categoryInput,
    dateInput,
    timeInput,
    teacherCheckbox,
    memoInput,
    addButton,
    sortButton,
    // selectElem,
    scheduleList = [],
    calendar,
    shortlistBtn,
    changeBtn,
    scheduleTable,
    draggingElement,
    currentPage = 1,
    itemsPerPage =
      Number.parseInt(localStorage.getItem("schedule-itemsPerPage")) || 5,
    totalPages = 0,
    itemsPerPageSelectElem,
    paginationCtnr,
    scheduleModalCloseBtn;

  getElements();
  addListeners();
  initCalendar();
  load();
  renderRows(scheduleList);
  updateSelectOptions();

  function getElements() {
    categoryInput = document.getElementById("categoryInput");
    memoInput = document.getElementById("memoInput");
    dateInput = document.getElementById("dateInput");
    timeInput = document.getElementById("timeInput");
    teacherCheckbox = document.getElementById("teacherCheckbox");
    addButton = document.getElementById("addBtn");
    sortButton = document.getElementById("sortBtn");
    // selectElem = document.getElementById("categoryFilter");
    shortlistBtn = document.getElementById("shortlistBtn");
    changeBtn = document.getElementById("changeBtn");
    scheduleTable = document.getElementById("scheduleTable");
    itemsPerPageSelectElem = document.getElementById("itemsPerPageSelectElem");
    paginationCtnr = document.querySelector(".pagination-pages");
    scheduleModalCloseBtn = document.getElementById("schedule-modal-close-btn");
  }

  function addListeners() {
    addButton.addEventListener("click", addEntry, false);
    sortButton.addEventListener("click", sortEntry, false);
    // selectElem.addEventListener("change", multipleFilter, false);
    shortlistBtn.addEventListener("change", multipleFilter, false);

    scheduleModalCloseBtn.addEventListener("click", closeEditModalBox, false);
    changeBtn.addEventListener("click", commitEdit, false);

    scheduleTable.addEventListener("dragstart", onDragstart, false);
    scheduleTable.addEventListener("drop", onDrop, false);
    scheduleTable.addEventListener("dragover", onDragover, false);

    paginationCtnr.addEventListener("click", onPaginationBtnsClick, false);
    itemsPerPageSelectElem.addEventListener(
      "change",
      selectItemsPerPage,
      false
    );
  }

  function addEntry(event) {
    let categoryValue = categoryInput.value;
    categoryInput.value = "";

    let dateValue = dateInput.value;
    dateInput.value = "";

    let timeValue = timeInput.value;
    timeInput.value = "";

    let teacherValue = teacherCheckbox.checked;
    teacherCheckbox.value = "";

    let memoValue = memoInput.value;
    memoInput.value = "";

    let obj = {
      id: _uuid(),
      category: categoryValue,
      date: dateValue,
      time: timeValue,
      teacher: teacherValue,
      memo: memoValue,
      done: false,
    };

    renderRow(obj);
    scheduleList.push(obj);
    save();
    updateSelectOptions();
    addEvent(obj);
  }

  function updateSelectOptions() {
    let options = [];

    scheduleList.forEach((obj) => {
      options.push(obj.category);
    });

    let optionsSet = new Set(options);

    // // empty the select options
    // selectElem.innerHTML = "";

    let newOptionElem = document.createElement("option");
    newOptionElem.value = DEFAULT_OPTION;
    newOptionElem.innerText = DEFAULT_OPTION;
    // selectElem.appendChild(newOptionElem);

    for (let option of optionsSet) {
      let newOptionElem = document.createElement("option");
      newOptionElem.value = option;
      newOptionElem.innerText = option;
      // selectElem.appendChild(newOptionElem);
    }
  }

  function save() {
    let stringified = JSON.stringify(scheduleList);
    localStorage.setItem("scheduleList", stringified);
  }

  function load() {
    let retrieved = localStorage.getItem("scheduleList");
    scheduleList = JSON.parse(retrieved);
    //console.log(typeof scheduleList)
    if (scheduleList == null) scheduleList = [];

    itemsPerPageSelectElem.value = itemsPerPage;
  }

  function renderRows(arr) {
    renderPageNumbers(arr);
    currentPage = currentPage > totalPages ? totalPages : currentPage;

    arr.forEach(addEvent);

    let slicedArr = arr.slice(
      itemsPerPage * (currentPage - 1),
      itemsPerPage * currentPage
    );
    slicedArr.forEach((scheduleObj) => {
      renderRow(scheduleObj);
    });
  }

  function renderRow({ category, id, date, time, teacher, memo, done }) {
    // add a new row

    let trElem = document.createElement("tr");
    scheduleTable.appendChild(trElem);
    trElem.draggable = "true";
    trElem.dataset.id = id;

    // checkbox cell
    let checkboxElem = document.createElement("input");
    checkboxElem.type = "checkbox";
    checkboxElem.addEventListener("click", checkboxClickCallback, false);
    checkboxElem.dataset.id = id;
    let tdElem1 = document.createElement("td");
    tdElem1.appendChild(checkboxElem);
    trElem.appendChild(tdElem1);

    // date cell
    let dateElem = document.createElement("td");
    dateElem.innerText = date; //formatDate(date);
    trElem.appendChild(dateElem);

    // time cell
    let timeElem = document.createElement("td");
    timeElem.innerText = time;
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
    editSpan.addEventListener("click", toEditItem, false);
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
    // checkboxElem.type = "checkbox";
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
      trElem.remove();
      updateSelectOptions();

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

  function sortEntry() {
    scheduleList.sort((a, b) => {
      let aDate = Date.parse(a.date);
      let bDate = Date.parse(b.date);
      return aDate - bDate;
    });

    save();

    clearTable();

    renderRows(scheduleList);
  }

  function initCalendar() {
    var calendarEl = document.getElementById("calendar");

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

  function addEvent({ id, category, date, time, done }) {
    calendar.addEvent({
      id: id,
      title: category,
      start: time === "" ? date : `${date}T${time}`,
      backgroundColor: done ? "#ddd" : "#89d0f8",
    });
  }

  function clearTable() {
    // Empty the table, keeping the first row
    let trElems = scheduleTable.getElementsByTagName("tr");
    for (let i = trElems.length - 1; i > 0; i--) {
      trElems[i].remove();
    }

    calendar.getEvents().forEach((event) => event.remove());
  }

  function multipleFilter() {
    clearTable();

    // let selection = selectElem.value;

    if (selection == DEFAULT_OPTION) {
      if (shortlistBtn.checked) {
        let resultArray = [];

        let filteredIncompleteArray = scheduleList.filter(
          (obj) => obj.done == false
        );
        //renderRows(filteredIncompleteArray);

        let filteredDoneArray = scheduleList.filter((obj) => obj.done == true);
        //renderRows(filteredDoneArray);

        resultArray = [...filteredIncompleteArray, ...filteredDoneArray];
        renderRows(resultArray);
      } else {
        renderRows(scheduleList);
      }
    } else {
      let filteredCategoryArray = scheduleList.filter(
        (obj) => obj.category == selection
      );

      if (shortlistBtn.checked) {
        let resultArray = [];

        let filteredIncompleteArray = filteredCategoryArray.filter(
          (obj) => obj.done == false
        );
        //renderRows(filteredIncompleteArray);

        let filteredDoneArray = filteredCategoryArray.filter(
          (obj) => obj.done == true
        );
        //renderRows(filteredDoneArray);

        resultArray = [...filteredIncompleteArray, ...filteredDoneArray];
        renderRows(resultArray);
      } else {
        renderRows(filteredCategoryArray);
      }
    }
  }

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

  function formatDate(date) {
    let dateObj = new Date(date);
    console.log(dateObj);
    let formattedDate = dateObj.toLocaleString("en-GB", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return formattedDate;
  }

  function showEditModalBox(event) {
    document.getElementById("schedule-overlay").classList.add("slidedIntoView");
  }

  function closeEditModalBox(event) {
    document
      .getElementById("schedule-overlay")
      .classList.remove("slidedIntoView");
  }

  function commitEdit(event) {
    closeEditModalBox();

    let id = event.target.dataset.id;
    let category = document.getElementById("schedule-edit-category").value;
    let date = document.getElementById("schedule-edit-date").value;
    let time = document.getElementById("schedule-edit-time").value;
    let teacher = document.getElementById("schedule-edit-teacher").value;
    let memo = document.getElementById("schedule-edit-memo").value;

    // remove from calendar
    calendar.getEventById(id).remove();

    for (let i = 0; i < scheduleList.length; i++) {
      if (scheduleList[i].id == id) {
        scheduleList[i] = {
          id: id,
          category: category,
          date: date,
          time: time,
          teacher: teacher,
          memo: memo,
          done: false,
        };

        addEvent(scheduleList[i]);
      }
    }

    save();

    // Update the table
    //let tdNodeList = scheduleTable.querySelectorAll("td");
    //let tdNodeList = scheduleTable.querySelectorAll("td[data-id='" + id + "']");
    let tdNodeList = scheduleTable.querySelectorAll(`td[data-id='${id}']`);
    for (let i = 0; i < tdNodeList.length; i++) {
      //if(tdNodeList[i].dataset.id == id){
      let type = tdNodeList[i].dataset.type;
      switch (type) {
        case "date":
          tdNodeList[i].innerText = formatDate(date);
          break;
        case "time":
          tdNodeList[i].innerText = time;
          break;
        case "category":
          tdNodeList[i].innerText = category;
          break;
        case "teacher":
          tdNodeList[i].innerText = teacher;
          break;
        case "memo":
          tdNodeList[i].innerText = memo;
          break;
      }
      //}
    }
  }

  function toEditItem(event) {
    showEditModalBox();

    let id;

    if (event.target)
      // mouse event
      id = event.target.dataset.id;
    // calendar event
    else id = event.id;

    preFillEditForm(id);
  }

  function preFillEditForm(id) {
    let result = scheduleList.find((scheduleObj) => scheduleObj.id == id);
    let { category, memo, date, time, teacher } = result;

    document.getElementById("schedule-edit-category").value = category;
    document.getElementById("schedule-edit-date").value = date;
    document.getElementById("schedule-edit-time").value = time;
    document.getElementById("schedule-edit-teacher").value = teacher;
    document.getElementById("schedule-edit-memo").value = memo;

    changeBtn.dataset.id = id;
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

  function calendarEventDragged(event) {
    let id = event.id;
    //console.log(`event.start : ${event.start}`);
    let dateObj = new Date(event.start);
    //console.log(`dateObj : ${dateObj}`);
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    let date = dateObj.getDate();
    let hour = dateObj.getHours();
    let minute = dateObj.getMinutes();
    //console.log(`time: ${hour}:${minute}`);

    let paddedMonth = month.toString();
    if (paddedMonth.length < 2) {
      paddedMonth = "0" + paddedMonth;
    }

    let paddedDate = date.toString();
    if (paddedDate.length < 2) {
      paddedDate = "0" + paddedDate;
    }

    let toStoreDate = `${year}-${paddedMonth}-${paddedDate}`;
    console.log(toStoreDate);

    scheduleList.forEach((scheduleObj) => {
      if (scheduleObj.id == id) {
        scheduleObj.date = toStoreDate;
        if (hour !== 0)
          scheduleObj.time = `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`;
      }
    });

    save();

    multipleFilter();
  }

  function onPaginationBtnsClick(event) {
    switch (event.target.dataset.pagination) {
      case "pageNumber":
        currentPage = Number(event.target.innerText);
        break;
      case "previousPage":
        currentPage = currentPage == 1 ? currentPage : currentPage - 1;
        break;
      case "nextPage":
        currentPage = currentPage == totalPages ? currentPage : currentPage + 1;
        break;
      case "firstPage":
        currentPage = 1;
        break;
      case "lastPage":
        currentPage = totalPages;
        break;
      default:
    }
    multipleFilter();
  }

  function renderPageNumbers(arr) {
    let numberOfItems = arr.length;
    totalPages = Math.ceil(numberOfItems / itemsPerPage);

    let pageNumberDiv = document.querySelector(".pagination-pages");

    pageNumberDiv.innerHTML = `<span class="material-icons chevron" data-pagination="firstPage">first_page</span>`;

    if (currentPage != 1)
      pageNumberDiv.innerHTML += `<span class="material-icons chevron" data-pagination="previousPage">chevron_left</span>`;

    if (totalPages > 0) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumberDiv.innerHTML += `<span data-pagination="pageNumber">${i}</span>`;
      }
    }

    if (currentPage != totalPages)
      pageNumberDiv.innerHTML += `<span class="material-icons chevron" data-pagination="nextPage">chevron_right</span>`;

    pageNumberDiv.innerHTML += `<span class="material-icons chevron" data-pagination="lastPage">last_page</span>`;
  }

  function selectItemsPerPage(event) {
    itemsPerPage = Number(event.target.value);
    localStorage.setItem("schedule-itemsPerPage", itemsPerPage);
    multipleFilter();
  }
}
