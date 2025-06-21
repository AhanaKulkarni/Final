# 2D to 3D Room Designer Application

## Overview

This is a full-stack web application that allows users to design rooms in 2D and visualize them in 3D. The application provides an interactive interface for drawing walls, placing furniture, and switching between 2D editing mode and 3D visualization mode. Built with React Three Fiber for 3D graphics, Tailwind CSS for styling, and includes a full authentication system with PostgreSQL database support.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **3D Rendering**: React Three Fiber (@react-three/fiber) with Three.js
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom component library
- **State Management**: Zustand for client-side state management
- **Build Tool**: Vite with hot module replacement
- **Asset Support**: GLTF/GLB models, audio files (MP3, OGG, WAV), GLSL shaders

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: TSX for TypeScript execution

### Key Components

#### 2D Room Designer
- **Canvas2D**: Interactive HTML5 canvas for 2D room editing
- **Wall Drawing**: Click-to-draw wall system with real-time preview
- **Furniture Placement**: Drag-and-drop furniture library with collision detection
- **Selection System**: Click-to-select furniture items with visual feedback

#### 3D Visualization
- **Canvas3D**: Three.js scene with orbit controls
- **3D Models**: Procedural furniture generation with customizable materials
- **Lighting**: Ambient and directional lighting setup
- **Camera**: Perspective camera with smooth controls

#### Augmented Reality Preview
- **ARPreview**: Real-time camera overlay with 3D room visualization
- **Camera Access**: Device camera integration using MediaDevices API
- **AR Controls**: Scale, position, and rotation controls for room placement
- **Cross-Platform**: Works on mobile and desktop devices with camera access

#### UI System
- **View Toggle**: Seamless switching between 2D, 3D, and AR modes
- **Furniture Library**: Categorized furniture templates with icons
- **Control Panel**: Room management and selected item controls
- **Undo/Redo**: Complete history tracking with undo/redo buttons
- **Real-time Updates**: State synchronization across all view modes

## Data Flow

1. **User Interaction**: User interacts with 2D canvas or furniture library
2. **State Updates**: Zustand stores update room data (walls, furniture)
3. **Component Re-render**: Both 2D and 3D components react to state changes
4. **Persistence**: Room data can be saved to PostgreSQL database
5. **Real-time Sync**: All views stay synchronized through shared state

## External Dependencies

### Core Libraries
- **React Three Fiber**: 3D scene management and rendering
- **Drizzle ORM**: Type-safe database operations
- **Neon Database**: Serverless PostgreSQL hosting
- **Radix UI**: Accessible component primitives
- **Zustand**: Lightweight state management
- **Tailwind CSS**: Utility-first styling

### Development Tools
- **Vite**: Fast build tool with HMR
- **TypeScript**: Type safety and developer experience
- **ESBuild**: Fast bundling for production
- **TSX**: TypeScript execution for development

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev` starts development server on port 5000
- **Hot Reload**: Vite provides instant updates during development
- **Error Handling**: Runtime error modal for development debugging

### Production Build
- **Client Build**: Vite bundles React app to `dist/public`
- **Server Build**: ESBuild bundles Express server to `dist/index.js`
- **Static Assets**: Served from `dist/public` directory

### Deployment Configuration
- **Platform**: Replit with autoscale deployment
- **Port Mapping**: Internal port 5000 mapped to external port 80
- **Environment**: Production mode with optimized builds

## Changelog

```
Changelog:
- June 20, 2025. Initial setup
- June 20, 2025. Enhanced room designer with:
  * Advanced 3D graphics with detailed furniture models and realistic lighting
  * Comprehensive furniture controls (resize, rotate, scale, color customization)
  * Canvas navigation with pan and zoom functionality
  * Wall color customization system
  * Fixed 3D furniture positioning to sit on floor
  * Added precise furniture rotation controls with slider
  * Improved UI with modern design and glass morphism effects
  * Complete doors and windows system with movable positioning along walls
  * 2D and 3D door/window rendering with realistic materials and customization
  * Interactive door/window controls with size, position, and color options
- June 21, 2025. Major feature additions:
  * Implemented augmented reality (AR) room preview using device camera
  * Added undo/redo functionality with complete history tracking
  * Enhanced door 3D models with realistic wooden frames and handles
  * Applied consistent white, beige/light brown, and black color theme
  * Integrated AR controls for room scaling, positioning, and rotation
  * Cross-platform camera access with mobile and desktop support
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```