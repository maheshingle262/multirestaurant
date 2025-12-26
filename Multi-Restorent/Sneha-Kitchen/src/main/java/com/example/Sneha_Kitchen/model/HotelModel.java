
package com.example.Sneha_Kitchen.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Document(collection = "hotels")
public class HotelModel {

    @Id
    private String id;
    private String hotelName;
    private String location;
    private String specialization;
    private List<HotelMenu> menu = new ArrayList<>();

    // Constructors
    public HotelModel() {}

    public HotelModel(String hotelName, String location, String specialization) {
        this.hotelName = hotelName;
        this.location = location;
        this.specialization = specialization;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getHotelName() { return hotelName; }
    public void setHotelName(String hotelName) { this.hotelName = hotelName; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public List<HotelMenu> getMenu() { return menu; }
    public void setMenu(List<HotelMenu> menu) { this.menu = menu; }

    // Equals and HashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        HotelModel that = (HotelModel) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
















/*package com.example.Sneha_Kitchen.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "hotels")
public class HotelModel {
    @Id
    private String id;
    private String hotelName;
    private String location;
    private String specialization;
    private List<MenuItem> menu;

    public static class MenuItem {
        private String foodName;
        private String category;
        private int price;

        public String getFoodName() { return foodName; }
        public void setFoodName(String foodName) { this.foodName = foodName; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public int getPrice() { return price; }
        public void setPrice(int price) { this.price = price; }
    }

    public String getId() { return id; }
    public String getHotelName() { return hotelName; }
    public void setHotelName(String hotelName) { this.hotelName = hotelName; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public List<MenuItem> getMenu() { return menu; }
    public void setMenu(List<MenuItem> menu) { this.menu = menu; }
}*/
