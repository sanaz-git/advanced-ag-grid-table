// import './App.css';
import { AgGridReact } from "ag-grid-react";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
// import Multiselect from "multiselect-react-dropdown";

// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';

import "./App.scss";

var filterParams = {
  comparator: (filterLocalDateAtMidnight, cellValue) => {
    var dateAsString = cellValue;
    if (dateAsString == null) return -1;
    var dateParts = dateAsString.split("/");
    var cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0])
    );
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
    return 0;
  },
  browserDatePicker: true,
  minValidYear: 2000,
  maxValidYear: 2021,
  inRangeFloatingFilterDateFormat: "Do MMM YYYY",
};

function App() {
  const containerStyle = useMemo(
    () => ({ width: "70vw", height: "100vh" }),
    []
  );
  const gridStyle = useMemo(() => ({ height: 600, width: "100%" }), []);

  const gridRef = useRef();
  //***************************** */
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [hideColumn, setHideColumn] = useState(false);

  const [show,setShow]=useState(false)


  const [rowData, setRowData] = useState([]);



  const [columnDefs, setColumnDefs] = useState([
    {
      field: "athlete",
      pinned: "left",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
      // rowDrag: true,
    },
    { field: "age", filter: "agNumberColumnFilter", },
    { field: "country", filter: "agTextColumnFilter" },
    { field: "sport", filter: "agTextColumnFilter" },
    { field: "year" },
    { field: "date", filter: "agDateColumnFilter", filterParams: filterParams },
    { field: "gold", filter: "agNumberColumnFilter" },
    { field: "silver", filter: "agNumberColumnFilter" },
    { field: "bronze", filter: "agNumberColumnFilter" },
    { field: "total", filter: "agNumberColumnFilter" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
      flex: 1,
      minWidth: 158,
      floatingFilter: true,
      filterParams: {
        buttons: ["apply", "clear", "reset"],
      },
      
    };
  }, []);

  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);

  const cellClickedListener = useCallback((e) => {
    console.log("cellClicked", e);
  });

  //deselect
  const deselect = useCallback (e => {
    gridRef.current.api.deselectAll();
  });


  //pagination
  const onPageSizeChanged = useCallback(() => {
    var value = document.getElementById("page-size").value;
    gridRef.current.api.paginationSetPageSize(Number(value));
  }, []);


  //global search
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById('filter-text-box').value
    );
  }, []);


  //show and hide columns
  function onGridReady(params) {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  }
  const showAge=()=>{
    // for single column
   // gridColumnApi.setColumnVisible('dob',hideColumn) 
   
   // for multiple columns
 gridColumnApi.setColumnVisible('age',hideColumn)
   setHideColumn(!hideColumn)
   // to fit the size of column
   gridApi.sizeColumnsToFit()
  }
  const showCountry=()=>{
   gridColumnApi.setColumnVisible('country',hideColumn)
   setHideColumn(!hideColumn)
   gridApi.sizeColumnsToFit()
  }
  const showSport=()=>{
   gridColumnApi.setColumnVisible('sport',hideColumn)
   setHideColumn(!hideColumn)
   gridApi.sizeColumnsToFit()
  }


  return (
    <div style={containerStyle}>
      <h1 className="title">AG GRID TABLE</h1>
      <div className="example-wrapper">
        <div className="example-header">

          <span>Page Size: </span>
          <select onChange={onPageSizeChanged} id="page-size">
            <option value="10">10</option>
            <option value="5">5</option>
            <option value="15">15</option>
          </select>
                 
          <input
            type="text"
            id="filter-text-box"
            placeholder="Search..."
            onInput={onFilterTextBoxChanged}

          />  

          <div >
          <button onClick={deselect} >Deselect</button>
            <button onClick={()=>{setShow(!show)}}>  Show and Hide Columns </button>
            
            {
              show?<div >
              <button onClick={showAge}>age</button>
              <button onClick={showCountry}>country</button>
              <button onClick={showSport}>sport</button>
            </div> : null            
            }
        </div>
        
        </div>
        
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            onGridReady={onGridReady}
            ref={gridRef}
            onCellClicked={cellClickedListener}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            //pagination
            animateRows={true}
            pagination={true}
            paginationPageSize={10}
            //checkbox
            rowSelection={"multiple"}
            suppressRowClickSelection={true}
            //dragrow
            // rowDragManaged={true} //dose not work when use pagination
          />
        </div>
      </div>
    </div>
  );
}

export default App;
