package com.backend.moviesgo.model;

import java.util.ArrayList;
import java.util.HashSet;
import com.backend.moviesgo.services.JsonService;

public class BuyerList {
  public HashSet<Buyer> users;
  public JsonService<Buyer> json = new JsonService<>("src/main/java/com/backend/moviesgo/json/buyers.json",
      Buyer.class);

  public BuyerList() {

    this.refresh();
  }

  public Buyer getBuyerById(String id) {

    if (users == null)
      return null;
    for (Buyer u : this.users) {

      if (u.id.equals(id))
        return u;
    }
    return null;
  }

  public boolean addBuyer(Buyer u) {

    if (this.users.add(u)) {
      this.json.guardar(new ArrayList<>(this.users));
      return true;
    }
    return false;
  }

  public void refresh() {
    this.users = new HashSet<Buyer>(this.json.cargar());

  }

  public Integer getMaxId() {
    Integer maxId = 0;
    for (Buyer u : this.users) {
      if (Long.parseLong(u.id) > maxId) {
        maxId = Integer.parseInt(u.id);
      }
    }
    return maxId;
  }
}
