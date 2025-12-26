package com.example.Sneha_Kitchen.model;

import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "all_orders")
public class AllOrder {

    @Id
    private String id;

    // customer info (snapshot at time of order)
    private String customerName;
    private String customerEmail;
    private String customerAddress;
    private String customerPhone;

    // order item info
    private String foodName;
    private int quantity;
    private double price; // price per item (or order total depending on your usage)

    // payment related
    private String paymentId;         // razorpay payment id
    private String paymentStatus;     // e.g., "paid", "failed"
    private String paymentMethod;     // card, upi, netbanking
    private double amountPaid;        // amount actually paid (in ₹)

    private String status; // Delivered / Pending / Ready / Completed
    private LocalDateTime orderDateTime;

    // multi-hotel support
    private String hotelName;

    // --- Constructors ---
    public AllOrder() {}

    // --- Getters & Setters ---
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }
    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerAddress() {
        return customerAddress;
    }
    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }
    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getFoodName() {
        return foodName;
    }
    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }
    public void setPrice(double price) {
        this.price = price;
    }

    public String getPaymentId() {
        return paymentId;
    }
    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }
    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public double getAmountPaid() {
        return amountPaid;
    }
    public void setAmountPaid(double amountPaid) {
        this.amountPaid = amountPaid;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getOrderDateTime() {
        return orderDateTime;
    }
    public void setOrderDateTime(LocalDateTime orderDateTime) {
        this.orderDateTime = orderDateTime;
    }

    public String getHotelName() {
        return hotelName;
    }
    public void setHotelName(String hotelName) {
        this.hotelName = hotelName;
    }

    @Override
    public String toString() {
        return "AllOrder [" +
               "id=" + id +
               ", customerName=" + customerName +
               ", customerEmail=" + customerEmail +
               ", customerAddress=" + customerAddress +
               ", customerPhone=" + customerPhone +
               ", foodName=" + foodName +
               ", quantity=" + quantity +
               ", price=" + price +
               ", paymentId=" + paymentId +
               ", paymentStatus=" + paymentStatus +
               ", paymentMethod=" + paymentMethod +
               ", amountPaid=" + amountPaid +
               ", status=" + status +
               ", orderDateTime=" + orderDateTime +
               ", hotelName=" + hotelName +
               "]";
    }
}











/*package com.example.Sneha_Kitchen.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "all_orders")  in this code without show detailes if customer
public class AllOrder {

    @Id
    private String id;
    private String customerName;
    private String customerEmail;  
    private String foodName;
    private int quantity;
    private double price;
    private String status; // Delivered / Pending
    private LocalDateTime orderDateTime;

    // 👇 Multi-hotel ke liye field
    private String hotelName;

    // --- Getters and Setters ---
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getFoodName() {
        return foodName;
    }
    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }
    public void setPrice(double price) {
        this.price = price;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getOrderDateTime() {
        return orderDateTime;
    }
    public void setOrderDateTime(LocalDateTime orderDateTime) {
        this.orderDateTime = orderDateTime;
    }

    public String getHotelName() {
        return hotelName;
    }
    public void setHotelName(String hotelName) {
        this.hotelName = hotelName;
    }

    @Override
    public String toString() {
        return "AllOrder [id=" + id +
               ", customerName=" + customerName +
               ", foodName=" + foodName +
               ", quantity=" + quantity +
               ", price=" + price +
               ", status=" + status +
               ", orderDateTime=" + orderDateTime +
               ", hotelName=" + hotelName + "]";
    }
	/**
	 * @return the customerEmail
	 /
	public String getCustomerEmail() {
		return customerEmail;
	}
	/**
	 * @param customerEmail the customerEmail to set
	 /
	public void setCustomerEmail(String customerEmail) {
		this.customerEmail = customerEmail;
	}
}*/
