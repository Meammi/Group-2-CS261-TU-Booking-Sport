package com.example.tu_bookingsports.DTO;

public class GeolocationResponse{
    private double latitude;
    private double longitude;

    public GeolocationResponse(double latitude,double longitude){
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public double getLatitude(){return this.latitude;}
    public void setLatitude(double latitude){this.latitude = latitude;}


    public double getLongitude(){return this.longitude;}
    public void setLongitude(double longitude){this.longitude = longitude;}
}