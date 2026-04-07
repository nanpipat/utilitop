"use client";

import { useCallback } from "react";
import ToolLayout from "@/components/layout/ToolLayout";
import DiagramEditor from "@/components/diagrams/DiagramEditor";
import { renderViaKroki, injectThaiFont } from "@/lib/tools/kroki";

const PRIVACY_NOTE = `PlantUML diagrams are rendered by kroki.io\nYour diagram source is sent to their servers.\nDo not include sensitive information.`;

const EXAMPLES = [
  {
    label: "Activity Swimlane (ไทย)",
    code: `@startuml
title กระบวนการสั่งซื้อสินค้าออนไลน์

|ลูกค้า|
start
:เลือกสินค้าใส่ตะกร้า;
:กรอกที่อยู่จัดส่ง;

|ระบบ|
:คำนวณค่าจัดส่ง;
:แสดงสรุปคำสั่งซื้อ;

|ลูกค้า|
:ชำระเงิน;

|Payment Gateway|
:ตรวจสอบการชำระเงิน;
if (ชำระเงินสำเร็จ?) then (ใช่)
  :ส่งผลยืนยัน;
else (ไม่สำเร็จ)
  :แจ้งชำระเงินล้มเหลว;
  stop
endif

|ระบบ|
:สร้างคำสั่งซื้อ;
:แจ้งเตือนทีมคลังสินค้า;

|คลังสินค้า|
:จัดเตรียมสินค้า;
:ส่งพัสดุ;

|ระบบ|
:อัปเดตสถานะการจัดส่ง;
:ส่ง Email ยืนยัน;

|ลูกค้า|
:รับสินค้า;
stop
@enduml`,
  },
  {
    label: "Sequence (ไทย)",
    code: `@startuml
participant ลูกค้า
participant "แอปมือถือ" as App
participant "API Server" as API
participant "ธนาคาร" as Bank
participant ฐานข้อมูล

ลูกค้า -> App: กดโอนเงิน
App -> API: POST /transfer
API -> ฐานข้อมูล: ตรวจสอบยอดเงิน
ฐานข้อมูล --> API: ยอดเงินคงเหลือ
API -> Bank: ส่งคำขอโอน
Bank --> API: ผลการโอน
alt โอนสำเร็จ
  API -> ฐานข้อมูล: บันทึกรายการ
  API --> App: โอนเงินสำเร็จ
  App --> ลูกค้า: แจ้งเตือน Push Notification
else โอนไม่สำเร็จ
  API --> App: แจ้ง Error
  App --> ลูกค้า: กรุณาลองใหม่อีกครั้ง
end
@enduml`,
  },
  {
    label: "Use Case",
    code: `@startuml
left to right direction
actor ลูกค้า as Customer
actor "พนักงานขาย" as Staff
actor "ผู้จัดการ" as Manager

rectangle "ระบบร้านอาหาร" {
  usecase "สั่งอาหาร" as UC1
  usecase "ชำระเงิน" as UC2
  usecase "จัดการเมนู" as UC3
  usecase "ดูรายงานยอดขาย" as UC4
  usecase "จัดการโต๊ะ" as UC5
  usecase "ยกเลิกออเดอร์" as UC6
}

Customer --> UC1
Customer --> UC2
Staff --> UC1
Staff --> UC5
Staff --> UC6
Manager --> UC3
Manager --> UC4
Manager --> UC6
@enduml`,
  },
  {
    label: "Class Diagram",
    code: `@startuml
abstract class Vehicle {
  + String plateNumber
  + String brand
  + int year
  + void startEngine()
  + void stopEngine()
}

class Car {
  + int numDoors
  + void openTrunk()
}

class Motorcycle {
  + String type
  + void wheelie()
}

class ElectricCar {
  + int batteryCapacity
  + void charge()
  + int getRange()
}

Vehicle <|-- Car
Vehicle <|-- Motorcycle
Car <|-- ElectricCar

class ParkingLot {
  + int totalSlots
  + List<Vehicle> parkedVehicles
  + void parkVehicle(Vehicle v)
  + void removeVehicle(String plate)
}

ParkingLot "1" o-- "many" Vehicle
@enduml`,
  },
  {
    label: "Component Diagram",
    code: `@startuml
package "Mobile App" {
  [iOS App]
  [Android App]
}

package "API Gateway" {
  [Load Balancer]
  [Rate Limiter]
}

package "Microservices" {
  [User Service]
  [Product Service]
  [Order Service]
  [Notification Service]
}

package "Storage" {
  database "User DB" as UDB
  database "Product DB" as PDB
  database "Order DB" as ODB
  queue "Message Queue" as MQ
}

[iOS App] --> [Load Balancer] : HTTPS
[Android App] --> [Load Balancer] : HTTPS
[Load Balancer] --> [Rate Limiter]
[Rate Limiter] --> [User Service]
[Rate Limiter] --> [Product Service]
[Rate Limiter] --> [Order Service]
[User Service] --> UDB
[Product Service] --> PDB
[Order Service] --> ODB
[Order Service] --> MQ
MQ --> [Notification Service]
@enduml`,
  },
];
export default function PlantUMLTool() {
  const renderPlantUML = useCallback(async (code: string): Promise<string> => {
    const processed = injectThaiFont(code);
    return renderViaKroki("plantuml", processed);
  }, []);

  return (
    <ToolLayout
      title="PlantUML"
      description="Create UML diagrams using PlantUML syntax"
    >
      <DiagramEditor
        language="PlantUML"
        defaultCode={EXAMPLES[0].code}
        examples={EXAMPLES}
        onRender={renderPlantUML}
        privacyNote={PRIVACY_NOTE}
        debounceMs={800}
        filename="plantuml-diagram"
      />
    </ToolLayout>
  );
}
