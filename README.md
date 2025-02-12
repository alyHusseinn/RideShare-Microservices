# RideShare-Microservices

## Table of Contents
* [Introduction](#introduction)
* [Architecture](#architecture)
* [Services](#services)
* [Technologies Used](#technologies-used)
* [Installation](#installation)
* [Usage](#usage)
<!-- * [API Endpoints](#api-endpoints)
* [Testing](#testing) -->

## Introduction
This project implements a real-time ride-sharing platform using a microservices architecture. It facilitates the connection between riders and drivers, manages trip status, processes payments, and provides real-time updates on trip progress. The platform aims to be efficient, scalable, and reliable, offering a seamless experience for both riders and drivers.

## Architecture

![Ride-Sharing Microservices Architecture](/.github/system-design.png)  *Overview of the system design*

### The system is composed of the following microservices:

*   **Api-Gateway:** Acts as the entry point for all requests, handling routing, authentication, authorization, rate limiting, and user management.
*   **Trips-Service:** Manages the lifecycle of a trip, including creation, status updates, and interactions with the Payments-Service upon trip completion.
*   **Matching-Service:**  Handles the crucial task of matching riders with nearby available drivers in real-time. It tracks driver locations and pending trips.
*   **Payments-Service:** Processes payments securely using Stripe.
*   **Client:** Serves the React frontend application using Nginx.
*   **Databases:** MongoDB, PostgreSQL (users, trips, and payments).


### The system utilizes several databases:

![Database Desing](/.github/db-design.png)  *Database Design*


*   **Users Database:** Stores user data.
*   **Trips Database:** Stores detailed information about each trip.
*   **Payments Database:** Stores payment records.
*   **NoSQL Database (MongoDB):**  Stores pending trip requests and real-time driver location data for efficient matching.

## Services

### 1. Api-Gateway

*   **Description:** The Api-Gateway is the single point of entry for all client requests. It handles authentication, authorization, rate limiting, and routes requests to the appropriate backend service.  It also manages user accounts.
*   **Technologies Used:**  Typescript, Nodejs, Expressjs, Drizzle ORM, Zod, Http-proxy.
<!-- *   **API Endpoints:** *(Document all API endpoints here)* -->

### 2. Trips-Service

*   **Description:** The Trips-Service manages the entire lifecycle of a trip.  It receives trip requests, updates trip status, and interacts with the Payments-Service to process payments upon trip completion.
*   **Technologies Used:** Golang, gen, gorm.
<!-- *   **API Endpoints:** *(Document all API endpoints here)* -->

### 3. Matching-Service

*   **Description:** The Matching-Service is responsible for matching riders with the nearest available drivers in real-time. It uses the NoSQL database to store and retrieve driver locations and pending trip requests.
*   **Technologies Used:** Typescript, Nodejs, Expressjs, SocketIO, Mongoose, Zod.
<!-- *   **API Endpoints:** *(Document all API endpoints here, if any)* -->

### 4. Client (client)

*   **Description:** Serves the React frontend using Nginx.
*   **Technologies Used:** React, Sockeio-client, React-Router, Nginx
*   **Port:** 80 (external)

<!-- ### 3. Payments-Service

*   **Description:** The Payments-Service handles all payment-related operations using Stripe.  It processes payments securely and provides confirmation to the Trips-Service.
*   **Technologies Used:** *(e.g., Stripe Java SDK, Stripe Python SDK)*
*   **Dependencies:** None (except Stripe API).
*   **API Endpoints:** *(Document all API endpoints here)* -->

## Technologies Used

*   **Languages:** Typescript, Nodejs, GO, Python.
*   **Frameworks:** Expressjs, Gen, React, Sockeio.
*   **Databases:** PostgreSQL, MongoDB.

## Installation

1.  **Clone the Repository:**

    ```bash
    git clone [https://github.com/alyHusseinn/RideShare-Microservices.git](https://github.com/alyHusseinn/RideShare-Microservices.git)
    cd mobility-app
    ```

2.  **Install Docker and Docker Compose:** *(Only if needed - most developers using containers will have this)*

    *   **Docker:** [https://docs.docker.com/get-docker/](https://www.google.com/url?sa=E&source=gmail&q=https://docs.docker.com/get-docker/)
    *   **Docker Compose:** [https://docs.docker.com/compose/install/](https://www.google.com/url?sa=E&source=gmail&q=https://docs.docker.com/compose/install/)

3.  **Configuration:**

    *   **Environment Variables:** Create `.env` files for each service by copying the provided `.env.example` file.

        ```bash
        ## You can use this command in Linux
        find . -type d -name "*" -exec sh -c 'cp "$1/.env.example" "$1/.env"' _ {} \;
        ```

4.  **Build and Run:**

    ```bash
    docker compose up -d
    ```

## Usage

1.  **Start Services:**

    ```bash
    docker compose up -d 
    ```
2.  **Access the Application:**

    Once all the containers are running (you can check with `docker compose ps`), you can access your application in your web browser at:

    ```
    http://localhost:80
    ```

    Nginx, running in the `client` container, is configured to serve on port 80.

## To-Do

- [ ] Build the Payment service using Python and Stipe.
- [ ] Refine the UI.

