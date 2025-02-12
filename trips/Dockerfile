# Stage 1: Build the Go application
FROM golang:1.19-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download dependencies; this step is cached if go.mod and go.sum are unchanged
RUN go mod download

# Copy the entire source code into the container
COPY . .

# Build the Go application with static linking
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o main .

# Stage 2: Create a minimal image with the compiled binary
FROM scratch

# Set the working directory inside the container
WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/main .

# Expose port 8080
EXPOSE 8080

# Command to run the executable
CMD ["./main"]