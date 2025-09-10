"use client";

import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import DashboardLayout from "../../components/dashboardlayout";

function DashboardPage() {
  const [order, setOrder] = useState({
    order_name: '',
    created_at: '',
    to_business_name: '',
    to_business_address: '',
    from_business_name: '',
    from_business_address: '',
    line_items: [
      {
        id: 1,
        title: '',
        quantity: '',
        unit_price: '',
        tax_rate: '',
        tax_amount: '',
        total_amount: '',
      },
    ],
    total_price: 0,
    note: '',
  });

  const invoiceRef = useRef();

  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => {
      let updatedOrder = { ...prevOrder };

      if (index !== null) {
        updatedOrder.line_items = updatedOrder.line_items.map((item, i) =>
          i === index ? { ...item, [name]: value } : item
        );
      } else {
        updatedOrder = { ...updatedOrder, [name]: value };
      }

      if (name === 'unit_price' || name === 'quantity' || name === 'tax_rate') {
        updatedOrder.line_items = updatedOrder.line_items.map((item, i) => {
          if (i === index) {
            const quantity = parseFloat(item.quantity) || 0;
            const unitPrice = parseFloat(item.unit_price) || 0;
            const taxRate = parseFloat(item.tax_rate) || 0;
            const newTaxAmount = taxRate * 0.01 * unitPrice * quantity;
            const totalAmount = unitPrice * quantity + newTaxAmount;
            return { ...item, tax_amount: newTaxAmount, total_amount: totalAmount };
          }
          return item;
        });

        const newTotal = updatedOrder.line_items.reduce((acc, item) => {
          const quantity = parseFloat(item.quantity) || 0;
          const unitPrice = parseFloat(item.unit_price) || 0;
          const taxAmount = item.tax_amount || 0;
          return acc + unitPrice * quantity + taxAmount;
        }, 0);
        updatedOrder.total_price = newTotal;
      }

      if (name === 'tax_rate') {
        updatedOrder.line_items = updatedOrder.line_items.map((item, i) => {
          if (i === index) {
            const quantity = parseFloat(item.quantity) || 0;
            const unitPrice = parseFloat(item.unit_price) || 0;
            const taxRate = parseFloat(value) || 0;
            const newTaxAmount = taxRate * 0.01 * unitPrice * quantity;
            const totalAmount = unitPrice * quantity + newTaxAmount;
            return { ...item, tax_amount: newTaxAmount, total_amount: totalAmount };
          }
          return item;
        });
      }
      return updatedOrder;
    });
  };

  const addLineItem = () => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      line_items: [
        ...prevOrder.line_items,
        {
          id: Date.now(),
          title: '',
          quantity: '',
          unit_price: '',
          tax_rate: '',
          tax_amount: '',
          total_amount: '',
        },
      ],
    }));
  };

  const removeLineItem = (id) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      line_items: prevOrder.line_items.filter((item) => item.id !== id),
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatRupees = (amount) => {
    if (typeof amount === 'number' && !isNaN(amount)) {
      return `₹${amount.toFixed(2)}`;
    }
    return '₹0.00';
  };

  const exportToPDF = () => {
    if (invoiceRef.current) {
      html2canvas(invoiceRef.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('invoice.pdf');
      });
    }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2>Enter Invoice Details</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" name="order_name" placeholder="Order Name" value={order.order_name} onChange={(e) => handleInputChange(e)} style={{ padding: '8px', border: '1px solid #ddd' }} />
            <input type="date" name="created_at" value={order.created_at} onChange={(e) => handleInputChange(e)} style={{ padding: '8px', border: '1px solid #ddd' }} />
            <input type="text" name="to_business_name" placeholder="To Business Name" value={order.to_business_name} onChange={(e) => handleInputChange(e)} style={{ padding: '8px', border: '1px solid #ddd' }} />
            <input type="text" name="to_business_address" placeholder="To Business Address" value={order.to_business_address} onChange={(e) => handleInputChange(e)} style={{ padding: '8px', border: '1px solid #ddd' }} />
            <input type="text" name="from_business_name" placeholder="From Business Name" value={order.from_business_name} onChange={(e) => handleInputChange(e)} style={{ padding: '8px', border: '1px solid #ddd' }} />
            <input type="text" name="from_business_address" placeholder="From Business Address" value={order.from_business_address} onChange={(e) => handleInputChange(e)} style={{ padding: '8px', border: '1px solid #ddd' }} />

            <h3>Line Items</h3>
            {order.line_items.map((item, index) => (
              <div key={item.id} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                <input type="text" name="title" placeholder="Prod/Service" value={item.title} onChange={(e) => handleInputChange(e, index)} style={{ padding: '8px', border: '1px solid #ddd', maxWidth: '150px' }} />
                <input type="number" name="quantity" placeholder="Quantity" value={item.quantity} onChange={(e) => handleInputChange(e, index)} style={{ padding: '8px', border: '1px solid #ddd', maxWidth: '80px' }} />
                <input type="number" name="unit_price" placeholder="Unit Price" value={item.unit_price} onChange={(e) => handleInputChange(e, index)} style={{ padding: '8px', border: '1px solid #ddd', maxWidth: '100px' }} />
                <input type="number" name="tax_rate" placeholder="Tax %" value={item.tax_rate} onChange={(e) => handleInputChange(e, index)} style={{ padding: '8px', border: '1px solid #ddd', maxWidth: '70px' }} />
                <input type="text" name="tax_amount" placeholder="Tax Amount" value={formatRupees(item.tax_amount)} readOnly style={{ padding: '8px', border: '1px solid #ddd', maxWidth: '100px' }} />
                <input type="text" name="total_amount" placeholder="Total Amount" value={formatRupees(item.total_amount)} readOnly style={{ padding: '8px', border: '1px solid #ddd', maxWidth: '120px' }} />
                <button type="button" onClick={() => removeLineItem(item.id)} style={{ padding: '8px', background: '#f0f0f0', border: '1px solid #ddd' }}>Remove</button>
              </div>
            ))}
            <button type="button" onClick={addLineItem} style={{ padding: '8px', background: '#e0f7fa', border: '1px solid #ddd' }}>Add Item</button>

            <textarea name="note" placeholder="Note" value={order.note} onChange={(e) => handleInputChange(e)} style={{ padding: '8px', border: '1px solid #ddd', width: '100%', minHeight: '100px' }} />
          </div>
        </div>

        <div ref={invoiceRef}>
          <h1 style={{ textAlign: 'left', paddingLeft: '10px' }}>Invoice</h1>
          <p style={{ textAlign: 'left', paddingLeft: '10px' }}>
            Order {order.order_name}<br />
            {formatDate(order.created_at)}
          </p>

          <div style={{ marginTop: '1.5em', textAlign: 'left', paddingLeft: '10px' }}>
            <div className="address">
              <strong>From</strong><br />
              {order.from_business_name} <br />
              {order.from_business_address} <br />
            </div>

            <div className="address" style={{ marginBottom: '20px' }}>
              <strong>Ship to</strong><br />
              {order.to_business_name}<br />
              {order.to_business_address}
            </div>
          </div>

          <hr />

          <h2>Order Details</h2>
          <table className="table-tabular" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', width: '15%' }}>Prod/Service</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', width: '8%' }}>Qty</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', width: '10%' }}>Unit Price</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', width: '7%' }}>Tax %</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', width: '10%' }}>Tax Amount</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', width: '12%' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.line_items.map((lineItem) => {
                return (
                  <tr key={lineItem.id}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{lineItem.title}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{lineItem.quantity}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{lineItem.unit_price}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{lineItem.tax_rate}%</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formatRupees(lineItem.tax_amount)}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formatRupees(lineItem.total_amount)}</td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan="5" style={{ textAlign: 'right', fontWeight: 'bold', border: '1px solid #ddd', padding: '8px' }}>Subtotal (Excl. Tax)</td>
                <td style={{ textAlign: 'right', border: '1px solid #ddd', padding: '8px' }}>
                  {formatRupees(
                    order.line_items.reduce((acc, item) => {
                      const quantity = parseFloat(item.quantity) || 0;
                      const finalPrice = parseFloat(item.unit_price) || 0;
                      return acc + quantity * finalPrice;
                    }, 0)
                  )}
                </td>
              </tr>
              <tr>
                <td colSpan="5" style={{ textAlign: 'right', fontWeight: 'bold', border: '1px solid #ddd', padding: '8px' }}>Total Tax</td>
                <td style={{ textAlign: 'right', border: '1px solid #ddd', padding: '8px' }}>
                  {formatRupees(order.line_items.reduce((acc, item) => acc + (item.tax_amount || 0), 0))}
                </td>
              </tr>
              <tr>
                <td colSpan="5" style={{ textAlign: 'right', fontWeight: 'bold', border: '1px solid #ddd', padding: '8px' }}>Total (Incl. Tax)</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold', border: '1px solid #ddd', padding: '8px' }}>{formatRupees(order.total_price)}</td>
              </tr>
            </tbody>
</table>

          {order.note && (
            <>
              <h2>Note</h2>
              <p>{order.note}</p>
              <div style={{ height: '20px', visibility: 'hidden' }}></div>
            </>
          )}
        </div>
        <button type="button" onClick={exportToPDF} style={{ padding: '8px', background: '#e0f7fa', border: '1px solid #ddd', marginTop: '10px' }}>Export to PDF</button>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;