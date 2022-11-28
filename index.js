// Author: Connor Tolderlund
// Email: connor_tolderlund@student.uml.edu

// nice constant to have for z-index stuff
const max_z_index = 2_147_483_647;

const recalculate = () => {
  // fetch bounds
  let min_x = Number(document.getElementById("min-x").value);
  let min_y = Number(document.getElementById("min-y").value);
  let max_x = Number(document.getElementById("max-x").value);
  let max_y = Number(document.getElementById("max-y").value);

  if (min_x > max_x) {
    // swap bounds
    let temp = min_x;
    min_x = max_x;
    max_x = temp;
  }

  if (min_y > max_y) {
    // swap the bounds
    let temp = min_y;
    min_y = max_y;
    max_y = temp;
  }

  // fetch container for the table
  let container = document.getElementById("table-container");
  container.classList.remove("hidden");
  container.classList.add("visible");

  let ul = document.getElementById("tab-container");

  let tabIndex = ul.children.length;

  let li = document.createElement("li");
  let a = document.createElement("a");
  a.textContent = `[${min_x}, ${max_x}] by [${min_y}, ${max_y}]`;
  a.setAttribute("href", `#tabs-${tabIndex}`);
  a.classList.add("tab");

  // create the deletion button for each tab when created
  let span1 = document.createElement("span");
  span1.textContent = "x";
  span1.classList.add("ui-icon", "ui-icon-close");
  span1.setAttribute("id", `remove-${tabIndex}`);

  // add removeal logic to the 'X' marks on the tabs upon creation
  span1.addEventListener("click", () => {
    $(`#tabs-${tabIndex}`).remove();
    $(`#remove-${tabIndex}`).closest("li").remove();

    // hide the tabs if there is nothing in it
    if ($("#table-container").children().length === 1) {
      $("#table-container").removeClass("visible");
      $("#table-container").addClass("hidden");
    }
  });

  // populate the tab with our newly created elements
  li.appendChild(a);
  li.appendChild(span1);
  ul.appendChild(li);

  // get the ranges we want in arrays
  let x_data = Array.from({ length: max_x - min_x + 1 }, (x, i) => i + min_x);
  let y_data = Array.from({ length: max_y - min_y + 1 }, (x, i) => i + min_y);

  // begin table creation
  let table = document.createElement("table");
  let thead = document.createElement("thead");
  table.appendChild(thead);

  let tr = document.createElement("tr");
  thead.appendChild(tr);

  // first element will be static in the upper left
  // corner of the table and will have the highest
  // z-index
  let th = document.createElement("th");
  th.setAttribute("scope", "col");
  th.classList.add("text-center", "p-2");
  tr.appendChild(th);
  th.style.zIndex = max_z_index;
  th.style.position = "sticky";
  th.style.top = 0;
  th.style.left = 0;

  let tbody = document.createElement("tbody");
  table.appendChild(tbody);

  // create a header element for each x value in the range
  x_data.forEach((x) => {
    let th = document.createElement("th");
    th.innerText = String(x);
    th.classList.add("text-center", "p-2");
    th.setAttribute("scope", "col");
    th.style.zIndex = max_z_index - 1;
    tr.appendChild(th);
  });

  // row iterations
  for (let i = 0; i < y_data.length; i++) {
    // add a row header
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.innerText = String(y_data[i]);
    th.classList.add("text-center", "p-2");
    tr.appendChild(th);

    // column iterations
    for (let j = 0; j < x_data.length; j++) {
      // add the data for each cell
      let td = document.createElement("td");
      td.classList.add("text-center", "p-2");
      td.innerText = String(x_data[j] * y_data[i]);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  // clear the container if a table is already rendered
  // container.innerHTML = "";
  let div = document.createElement("div");
  div.setAttribute("id", `tabs-${tabIndex}`);
  div.appendChild(table);
  // table.classList.add("mult-table");
  div.classList.add("mult-table-tab", "pb-2");
  // div.setAttribute("role", "tabpanel");
  table.classList.add("mult-table");

  // add the newly created table
  container.appendChild(div);
  $("#table-container").tabs("refresh");
};

// // prevent form from forcing a page refresh, if not,
// // any form submission nukes the data
document.getElementById("table-range-form").addEventListener("submit", (e) => {
  e.preventDefault();
});

$(document).ready(() => {
  // same rules for all 4 fields
  const num_rules = {
    required: true,
    min: -100,
    max: 100,
  };

  // actual validation logic
  $("#table-range-form").validate({
    rules: {
      minx: num_rules,
      maxx: num_rules,
      miny: num_rules,
      maxy: num_rules,
    },
    messages: {
      minx: {
        required: "Please enter a minimum x value",
        min: "The minimum allowed value is -100",
        max: "The maximum allowed value is 100",
      },
      maxx: {
        required: "Please enter a maximum x value",
        min: "The minimum allowed value is -100",
        max: "The maximum allowed value is 100",
      },
      miny: {
        required: "Please enter a minimum y value",
        min: "The minimum allowed value is -100",
        max: "The maximum allowed value is 100",
      },
      maxy: {
        required: "Please enter a maximum y value",
        min: "The minimum allowed value is -100",
        max: "The maximum allowed value is 100",
      },
    },
  });

  $("#table-container").tabs();

  $("#table-range-form").submit((e) => {
    if ($("#table-range-form").valid()) {
      recalculate();
    }
  });

  const slider_ids = [
    "slider-min-x",
    "slider-max-x",
    "slider-min-y",
    "slider-max-y",
  ];

  const text_field_ids = ["min-x", "max-x", "min-y", "max-y"];

  // this creates the two-way binding
  // used arrays of the ids needed to accomplish this
  // to make code cleaner
  for (let i = 0; i < 4; i++) {
    $(`#${slider_ids[i]}`).slider({
      min: -100,
      max: 100,
      step: 1,
      slide: (e, u) => {
        $(`#${text_field_ids[i]}`).val(u.value);
      },
    });

    $(`#${text_field_ids[i]}`).change(() => {
      $(`#${slider_ids[i]}`).slider(
        "option",
        "value",
        $(`#${text_field_ids[i]}`).val()
      );
    });
  }
});
