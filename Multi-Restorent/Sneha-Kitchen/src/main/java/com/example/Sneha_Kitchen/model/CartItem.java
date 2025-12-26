package com.example.Sneha_Kitchen.model;

public class CartItem {
    private String productId;    // id of Menu / Food item
    private String name;
    private double price;
    private int quantity;
    private String hotelId;    
    private String hotelName;// optional: which hotel the item belongs to

    public CartItem() {}



	public String getProductId() {
		return productId;
	}

	public void setProductId(String productId) {
		this.productId = productId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public String getHotelId() {
		return hotelId;
	}

	public void setHotelId(String hotelId) {
		this.hotelId = hotelId;
	}



	/**
	 * @return the hotelName
	 */
	public String getHotelName() {
		return hotelName;
	}



	/**
	 * @param hotelName the hotelName to set
	 */
	public void setHotelName(String hotelName) {
		this.hotelName = hotelName;
	}
	
}
