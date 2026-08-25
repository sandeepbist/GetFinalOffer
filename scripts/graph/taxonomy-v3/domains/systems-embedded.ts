import { s, type SkillDef } from "../types";

export const SYSTEMS_EMBEDDED: SkillDef[] = [
  // ── Systems Programming & OS Internals ──
  s("systems-programming", "Systems Programming", "systems-core", ["systems programming", "low-level programming", "memory management", "pointers and memory", "manual memory allocation", "stack and heap", "buffer overflow prevention"], ["high-demand", "core"]),
  s("linux-kernel", "Linux Kernel Development & Internals", "systems-os", ["kernel development", "linux kernel modules", "lkm", "kernel drivers", "kernel space user space", "sysfs procfs", "interrupt handling linux"]),
  s("ebpf", "eBPF (Extended Berkeley Packet Filter)", "systems-os", ["ebpf", "bpf", "bcc tools", "bpftrace", "ebpf observability", "ebpf networking", "ebpf security", "xdp express data path"], ["trending", "high-demand"]),
  s("linux-administration", "Linux System Administration (SysAdmin)", "systems-os", ["linux admin", "linux sysadmin", "ubuntu server", "rhel red hat enterprise linux", "debian", "centos", "rocky linux", "systemd service management", "cron jobs", "chmod chown permissions", "ssh configuration"], ["high-demand", "core"]),
  s("posix-api", "POSIX & Unix System Calls", "systems-os", ["posix api", "unix system calls", "fork exec wait", "pipes signals", "pthreads", "posix threads", "ipc inter process communication"]),
  s("windows-internals", "Windows Internals & Win32 API", "systems-os", ["win32 api", "windows internals", "windows drivers", "windows registry", "com dcom", "ntfs"]),
  s("memory-safety", "Memory Safety & Concurrency Control", "systems-core", ["memory safety", "borrow checker rust", "ownership and borrowing", "data race prevention", "memory leak detection", "valgrind", "addresssanitizer asan"]),

  // ── Networking, Sockets & Protocols ──
  s("tcp-ip-networking", "TCP/IP Protocol Suite & Network Architecture", "networking", ["tcp ip", "tcp/ip networking", "osi 7 layer model", "tcp three-way handshake", "tcp flow control", "tcp congestion control", "tcp sockets"], ["high-demand", "core"]),
  s("udp-protocol", "UDP Protocol & Real-Time Transport", "networking", ["udp", "user datagram protocol", "udp sockets", "quic over udp", "rtp rtcp real time transport"]),
  s("http-protocols", "HTTP/1.1, HTTP/2 & HTTP/3 Protocols", "networking", ["http protocols", "http/1.1", "http/2 multiplexing", "http/3 quic protocol", "http headers", "http status codes", "keep-alive"], ["core"]),
  s("dns-architecture", "DNS Architecture & Management", "networking", ["dns", "domain name system", "a aaaa cname mx txt records", "dns propagation", "dnssec", "recursive vs authoritative dns"]),
  s("bgp-routing", "BGP & Network Routing Protocols", "networking", ["bgp", "border gateway protocol", "ospf", "autonomous systems as", "routing tables"]),
  s("load-balancing-concept", "Load Balancing Algorithms & Architecture", "networking", ["load balancing", "round robin", "least connections", "ip hash", "layer 4 vs layer 7 load balancing", "global server load balancing gslb"]),
  s("cdn-architecture", "Content Delivery Networks (CDN)", "networking", ["cdn", "cdn caching", "edge caching", "origin shielding", "cdn purge invalidation", "fastly", "akamai"]),
  s("socket-programming", "Socket Programming (Network Sockets)", "networking", ["socket programming", "raw sockets", "berkeley sockets", "epoll kqueue io_uring", "asynchronous non-blocking network io"], ["core"]),
  s("mqtt-protocol", "MQTT Protocol (IoT Messaging)", "networking-iot", ["mqtt", "mqtt broker", "mosquitto", "emqx", "pub sub iot"]),
  s("coap-protocol", "CoAP Protocol (Constrained Application Protocol)", "networking-iot", ["coap", "iot coap protocol"]),

  // ── Embedded Systems & Microcontrollers ──
  s("embedded-systems-engineering", "Embedded Systems Engineering", "embedded-core", ["embedded systems", "embedded software", "firmware engineering", "embedded c programming", "bare metal programming", "cross compilation toolchains"], ["high-demand", "core"]),
  s("microcontrollers", "Microcontroller Architecture (MCU)", "embedded-hardware", ["microcontrollers", "mcu", "gpio", "i2c bus", "spi bus", "uart serial communication", "can bus controller area network", "adc dac", "pwm pulse width modulation"], ["core"]),
  s("arm-cortex", "ARM Architecture & Cortex-M / Cortex-A", "embedded-hardware", ["arm cortex-m", "arm cortex-a", "arm thumb", "cmsis", "arm assembly", "arm trustzone"]),
  s("risc-v", "RISC-V Architecture", "embedded-hardware", ["risc-v", "riscv", "open source instruction set risc-v"]),
  s("stm32", "STM32 Microcontrollers", "embedded-hardware", ["stm32", "stmicroelectronics", "stm32cubeide", "hal drivers stm32"]),
  s("esp32-esp8266", "ESP32 & ESP8266 (Espressif)", "embedded-hardware", ["esp32", "esp8266", "esp-idf", "espressif iot", "freertos esp32", "wifi bluetooth ble esp32"]),
  s("raspberry-pi-hw", "Raspberry Pi & Single Board Computers (SBC)", "embedded-hardware", ["raspberry pi", "rpi 4", "rpi 5", "raspberry pi pico", "gpio python rpi"]),
  s("arduino-platform", "Arduino Platform", "embedded-hardware", ["arduino", "arduino uno", "arduino ide", "arduino c++"]),

  // ── Real-Time Operating Systems (RTOS) ──
  s("freertos", "FreeRTOS", "rtos", ["free rtos", "freertos tasks", "freertos queues semaphores", "real time kernel"]),
  s("zephyr-rtos", "Zephyr RTOS", "rtos", ["zephyr", "zephyr project", "linux foundation zephyr"]),
  s("vxworks", "VxWorks (Wind River)", "rtos", ["vxworks", "wind river rtos", "hard real time operating system"]),
  s("qnx-rtos", "BlackBerry QNX", "rtos", ["qnx", "qnx neutrino", "automotive rtos"]),

  // ── Robotics & Autonomous Systems ──
  s("ros-robotics", "Robot Operating System (ROS / ROS2)", "robotics", ["ros", "ros2", "robot operating system", "ros nodes topics services", "urdf", "rviz", "gazebo simulation", "navigation2 nav2"], ["trending", "high-demand"]),
  s("gazebo-simulation", "Gazebo Simulation", "robotics", ["gazebo robotics simulator", "ignition gazebo"]),
  s("slam-robotics", "SLAM (Simultaneous Localization and Mapping)", "robotics", ["slam", "lidar slam", "visual slam vslam", "robot path planning", "a* dijkstra pathfinding"]),

  // ── Hardware Description, FPGA & Chip Design ──
  s("fpga-development", "FPGA Design & Development", "hardware-fpga", ["fpga", "xilinx fpga", "intel altera fpga", "vivado design suite", "quartus prime", "rtl design", "timing closure fpga"], ["high-demand"]),
  s("verilog-vhdl-design", "RTL Design (Verilog / SystemVerilog / VHDL)", "hardware-fpga", ["rtl design", "asic design", "synthesis and simulation", "testbench verification"]),

  // ── Game Engines & Graphics Programming ──
  s("unity-engine", "Unity Game Engine", "game-engine", ["unity", "unity3d", "unity c# scripting", "unity physics", "unity uxml ui toolkit", "universal render pipeline urp", "high definition render pipeline hdrp", "unity shaders", "unity vr/ar"], ["high-demand", "core"]),
  s("unreal-engine", "Unreal Engine (UE4 / UE5)", "game-engine", ["unreal engine", "ue5", "unreal engine 5", "unreal c++", "blueprints unreal", "nanite ue5", "lumen ue5", "chaos physics unreal", "gameplay ability system gas"], ["high-demand", "core"]),
  s("godot-engine", "Godot Engine", "game-engine", ["godot", "godot 4", "gdscript", "open source game engine godot"]),
  s("computer-graphics-api", "Graphics APIs (OpenGL / Vulkan / DirectX / Metal)", "graphics-api", ["opengl", "vulkan api", "directx 12 dx12", "apple metal api", "graphics rendering pipeline", "shader programming glsl hlsl"]),
  s("physics-engines", "Physics Simulation Engines (PhysX / Havok / Bullet)", "game-physics", ["nvidia physx", "havok physics", "bullet physics library"]),
];
