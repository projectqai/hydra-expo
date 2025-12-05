# Hydra View

Open-source situational awareness application built with Expo/React Native.

## Contributing

For security reasons, contributions are invite-only at this time.

## Prerequisites

- [Bun](https://bun.sh)
- [Android SDK](https://developer.android.com/studio) (for Android development)

## Setup

```bash
bun install
cp env-example .env.development
```

## Development

```bash
bun dev           # start dev server
bun web           # start web
bun android       # build & run android
```

## Environment

| Variable                    | Description     | Default                  |
| --------------------------- | --------------- | ------------------------ |
| `EXPO_PUBLIC_HYDRA_API_URL` | Backend API URL | `window.location.origin` |

> **Note:** `EXPO_PUBLIC_HYDRA_API_URL` is optional when the frontend is bundled with the backend (single binary). When running the backend separately during development, set this to your backend URL (e.g., `http://localhost:50051`).

## Native Development

### Android

When running the backend locally, set up port forwarding so the device can reach localhost:

```bash
adb reverse tcp:50051 tcp:50051
```

## Troubleshooting

If you change environment variables or encounter stale cache issues, clear the Expo cache:

```bash
bun dev --clear
```

## Build

```bash
bun build         # build app
bun build:web     # build web
bun serve         # serve production build
```
