package com.backend.moviesgo.services;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.backend.moviesgo.model.Buyer;

@Service
public class BuyerService {

    public JsonService<Buyer> json = new JsonService<>("src/main/java/com/backend/moviesgo/json/buyers.json",
      Buyer.class);


    public Buyer updateBuyer(String id, Buyer newData) throws IOException{

        List<Buyer> buyers = json.cargar();

        Buyer existingBuyer = buyers.stream()
        .filter(m -> m.id.equalsIgnoreCase(id))
        .findFirst()
        .orElseThrow(() -> new RuntimeException("comprador no ENCONTRADo")); 

        if (newData.name == null || newData.name.trim().isEmpty() || newData.email == null || newData.email.trim().isEmpty() || newData.address == null || newData.address.trim().isEmpty() || newData.phone == null || newData.phone.trim().isEmpty()) { throw new RuntimeException("no pueden haber campos vacios"); }
        if (newData.name != null && newData.name.matches(".*\\d.*")) throw new RuntimeException("el nombre no debe contener numeros");
        if (newData.email == null || !newData.email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) { throw new RuntimeException("formato de email invalido"); }
        if (newData.phone != null && !newData.phone.matches("\\d+")) { throw new RuntimeException("el telefono debe ser numerico"); }
        System.out.println(("HASTA AQUI LLEGAMOS"));

        existingBuyer.name  = newData.name;
        existingBuyer.email  = newData.email;
        existingBuyer.address = newData.address;
        existingBuyer.phone = newData.phone;
        json.guardar(buyers);

        return existingBuyer;

    }    

        public Buyer[] deleteBuyer(String id) throws IOException{
        List <Buyer> buyers = json.cargar();

        boolean exists = buyers.stream()
                    .anyMatch(m -> m.id.equals(id));

        if(!exists) {
            throw new RuntimeException("comprador no encontrado");
        }

        buyers =buyers.stream()
                .filter(m -> !m.id.equals(id))
                .collect(Collectors.toList());

        json.guardar(buyers);
        return buyers.toArray(new Buyer[0]);
    }

}
