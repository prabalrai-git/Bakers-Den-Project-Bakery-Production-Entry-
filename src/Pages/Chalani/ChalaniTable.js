import { EditOutlined } from '@ant-design/icons';
import { Button, DatePicker, message, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { CSVLink } from 'react-csv';
import styled from 'styled-components';
import Header from '../../Components/Common/Header';
import { newTableStyles } from '../../Components/Common/TableStyles';
import { GetChalanDetailByDate, GetChalanItemDetailsByChalansId } from '../../Services/appServices/ProductionService';

const { RangePicker } = DatePicker;

const dummydata = [
  {
    name: "Dark Forest",
    price: '20',
    id: 1,
  },
  {
    name: "Red velvet",
    price: '110',
    id: 2,
  },
  {
    name: "White Forest",
    price: '200',
    id: 3,
  },
  {
    name: "Butter Scotch Cake",
    price: '2500',
    id: 4,
  },
  {
    name: "Banana Cake",
    price: '2500',
    id: 5,
  }
]

const ChalaniTable = (props) => {
  const { reloadTable } = props;
  // const [isEditing, setisEditing] = useState(false);
  const [ProductList, setProductList] = useState();
  // const [editingProduct, setEditingProduct] = useState();
  const [ChalaniItemList, setChalaniItemList] = useState();

  const [isModalVisible, setIsModalVisible] = useState(false);
  useEffect(() => {
    if (reloadTable === true) { getTableData() }
  }, [reloadTable])
  useEffect(() => {
    // const date = new Date().toISOString();
    const date = {
      fromdate: new Date().toISOString(),
      // fromdate: '2022-6-6',
      todate: new Date().toISOString(),
    }
    GetChalanDetailByDate(date, (res) => {
      if (res?.chalandetails.length > 0) {
        setProductList(res?.chalandetails)
      }

    })
  }, [])

  function onDateRangeChange(data) {
    let newData = {
      fromdate: data[0].format('YYYY-MM-DD'),
      todate: data[1].format('YYYY-MM-DD')
    }
    getTableData(newData)
    // console.log(data);

  }

  function getTableData(date) {
    GetChalanDetailByDate(date, (res) => {
      if (res?.chalandetails.length > 0) {
        setProductList(res?.chalandetails)
      }

    })
  }

  const handlePreview = (e) => {
    // console.log("e", e.DCId)
    setIsModalVisible(true);
    GetChalanItemDetailsByChalansId(e.DCId, (res) => {
      console.log("res", res.chalandetails)
      if (res.chalandetails.length > 0) {
        setChalaniItemList(res.chalandetails)
      }
    })
  }
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'DCId',
      dataIndex: 'DCId',
      key: 'DCId',
    },
    {
      title: 'PartyName',
      dataIndex: 'PartyName',
      key: 'PartyName',
    },
    {
      title: 'PartyAddress',
      dataIndex: 'PartyAddress',
      key: 'PartyAddress',
    },
    {
      title: 'EntryDate',
      dataIndex: 'EntryDate',
      key: 'EntryDate',
    },
    {
      title: 'DeliveryDate',
      dataIndex: 'DeliveryDate',
      key: 'DeliveryDate',
    },

    {
      title: 'Remarks',
      dataIndex: 'Remarks',
      key: 'Remarks',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <>
            <CIcon onClick={() => {
              handlePreview(record)
            }}>
              <EditOutlined />
              <span>View</span>
              {/* <Button >
                <FcPrint style={{ marginRight: '5px', fontSize: '20px' }} /> Print
              </Button> */}
            </CIcon>
          </>
        );
      },
    },

  ];

  const columnsChalan = [
    {
      title: 'ItemId',
      dataIndex: 'ItemId',
      key: 'ItemId',
      render: (text, record) => {
        const a = dummydata.map(res => {
          if (res.id === text)
            return res.name
          else
            return ''
        })
        return a

      }
    },
    {
      title: 'Quantity',
      dataIndex: 'Quantity',
      key: 'Quantity',
    },
    {
      title: 'Remarks',
      dataIndex: 'Remarks',
      key: 'Remarks',
    },
  ]
  //CSV
  const headers = [
    { label: 'DCId', key: 'DCId' },
    { label: 'PartyName', key: 'PartyName' },
    { label: 'PartyAddress', key: 'PartyAddress' },
    // { label: 'Quantity', key: 'Quantity' },
    { label: 'EntryDate', key: 'EntryDate' },
    { label: 'DeliveryDate', key: 'DeliveryDate' },
    { label: 'Remarks', key: 'Remarks' },
  ]
  // handel print
  const printHandle = () => {
    if (ProductList !== undefined) {
      let newWindow = window.open()

      let newStyle = ``

      newStyle = `<style>thead > tr> th:first-child, thead > tr> th:nth-child(2), tbody > tr > td:first-child,tbody > tr > td:nth-child(2){
        display: none;
       }tbody > tr:last-child{
    background-color: #f0f0f2;
    }
    tbody > tr:last-child > td{
        font-size: 12px;
        font-weight: 500;
    }</style>`

      let refName = `
      <div style='text-align:center;'>
          <h1>Baker's Den Pvt.ltd<h1>
          <h3>Naxal, Bhatbhateni, Kathmandu, Phone: 01-4416560<h3>
          <h5>Production Data<h5>
      </div>
    
      `;

      let tableBody = '';
      let tableHeadHtml = '<thead>';
      let columns = [];

      headers.forEach(ele => {
        tableHeadHtml += `<th>${ele?.label}</th>`;
        columns.push(ele.label);
      })
      tableHeadHtml += '</thead>';

      ProductList.forEach(ele => {
        tableBody = tableBody + '<tr>'
        columns.forEach(cell => {
          tableBody = tableBody + '<td>' + ele[cell] + '</td>'
        })
        tableBody = tableBody + '</tr>'
      })

      let allTable = `<table>${tableHeadHtml}${tableBody}</table>`

      newWindow.document.body.innerHTML = newTableStyles + newStyle + refName + allTable

      setTimeout(function () {
        newWindow.print();
        newWindow.close();
      }, 300);
    }
    else {
      message.info('select some data')
    }


  }


  return (
    <div className='mainContainer'>
      <Header title={"View Chalani"}></Header>
      <Button type='primary' style={{marginLeft: "16px", float: 'right' }} onClick={printHandle}>Print</Button>
      <Button type='primary' style={{float: 'right' }}><CSVLink data={ProductList !== undefined ? ProductList : ''} filename={'chalaniData.csv'}>Export to CSV</CSVLink>
      </Button>
      <RangePicker
        onChange={(value) => { onDateRangeChange(value) }}
      />

      <div >
        <Table columns={columns} dataSource={ProductList !== undefined ? ProductList : ''} scroll={{
          y: 340,
        }} />

      </div>
      <Modal width={900} title="Product List" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        {
          // ChalaniItemList!== undefined &&
          // <>
          // {
          //   ChalaniItemList.map(e => (
          //     <>
          //     <p>{e.ItemId}</p>
          //     <p>{e.Quantity}</p>
          //     <p>{e.Remarks}</p>
          //     </>
          //   ))
          // }
          // </>

          <Table columns={columnsChalan} dataSource={ChalaniItemList} scroll={{
            y: 140,
          }} />
        }
      </Modal>
    </div>
  )
}

export default ChalaniTable

const CIcon = styled.div`
  border: 1px solid #84b0c9d5;
  cursor: pointer;
  width: 60px;
  height: 24px;
  border-radius: 4px;
  color: #84b0c9;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  /* span{
    margin-left: 16px;
  } */

  &:hover{
    background-color: #84b0c9;
    color: #fefefe;
  }
`