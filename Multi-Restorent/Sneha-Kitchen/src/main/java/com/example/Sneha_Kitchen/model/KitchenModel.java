package com.example.Sneha_Kitchen.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "orders")
public class KitchenModel {

    @Id
    private String id;

    // Customer details
  
    private String customerName;
    private String address;
    private String contact;

    // Order status (Preparing, Ready, Completed, Cancelled)
    private String status;

    // List of ordered items
    private List<OrderItem> items;

    // Total bill amount
    private int total;

    // ✅ Date of order (yyyy-MM-dd format)
    private String date;

    // ✅ Time of order (HH:mm:ss format)
    private String time;

    // Default constructor
    public KitchenModel() {
        this.status = "Preparing"; // Default status
    }

    // Constructor with all fields except ID
    public KitchenModel(String customerName, String address, String contact,
                        List<OrderItem> items, int total, String date, String time) {
        this.customerName = customerName;
        this.address = address;
        this.contact = contact;
        this.items = items;
        this.total = total;
        this.date = date;
        this.time = time;
        this.status = "Preparing";
    }

    // ====== Inner class for Order Items ======
    public static class OrderItem {
        private String foodName;
        private String category;
        private int price;
        private int quantity;

        public OrderItem() {}

        public OrderItem(String foodName, String category, int price, int quantity) {
            this.foodName = foodName;
            this.category = category;
            this.price = price;
            this.quantity = quantity;
        }

        public String getFoodName() {
            return foodName;
        }

        public void setFoodName(String foodName) {
            this.foodName = foodName;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public int getPrice() {
            return price;
        }

        public void setPrice(int price) {
            this.price = price;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }

    // ====== Getters and Setters ======

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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

	
	}



















