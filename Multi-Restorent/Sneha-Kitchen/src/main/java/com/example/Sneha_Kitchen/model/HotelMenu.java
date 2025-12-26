package com.example.Sneha_Kitchen.model;

import java.util.Objects;

public class HotelMenu {

    private String foodName;
    private String category;
    private int price;

    // Constructors
    public HotelMenu() {}

    public HotelMenu(String foodName, String category, int price) {
        this.foodName = foodName;
        this.category = category;
        this.price = price;
    }

    // Getters and Setters
    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }

    // toString
    @Override
    public String toString() {
        return "HotelMenu{" +
               "foodName='" + foodName + '\'' +
               ", category='" + category + '\'' +
               ", price=" + price +
               '}';
    }

    // Equals and HashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        HotelMenu hotelMenu = (HotelMenu) o;
        return price == hotelMenu.price &&
               Objects.equals(foodName, hotelMenu.foodName) &&
               Objects.equals(category, hotelMenu.category);
    }

    @Override
    public int hashCode() {
        return Objects.hash(foodName, category, price);
    }
}


