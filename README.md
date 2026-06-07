# FishNet - Forum Wędkarskie

FishNet to nowoczesna aplikacja webowa służąca jako forum społecznościowe dla pasjonatów wędkarstwa. Umożliwia użytkownikom rejestrację, zakładanie wątków, publikowanie postów, dodawanie załączników oraz przeszukiwanie dyskusji. Aplikacja oparta jest na architekturze mikroserwisowej i przystosowana do wdrożenia w środowisku Kubernetes.

## Struktura projektu

Projekt zorganizowany jest jako monorepo i składa się z następujących głównych katalogów:

- `backend/` - Kod źródłowy API napisanego w Javie z wykorzystaniem frameworka Spring Boot.
- `frontend/` - Kod źródłowy aplikacji klienckiej napisanej w TypeScript z wykorzystaniem biblioteki React i narzędzia Vite.
- `k8s/` - Manifesty Kubernetes (.yaml) definiujące zasoby klastra (Deployments, Services, ConfigMaps, Secrets, PVC) oraz schemat bazy danych.
- `scripts/` - Skrypty bashowe ułatwiające automatyzację budowania obrazów i wdrażania aplikacji w Minikube.
- `backend/Dockerfile` & `frontend/Dockerfile` - Pliki konfiguracyjne kontenerów znajdujące się bezpośrednio w folderach projektów.

## Instrukcja uruchomienia w Minikube

Poniższe kroki przeprowadzą Cię przez proces uruchomienia aplikacji w lokalnym klastrze Minikube.

### Wymagania wstępne
Zanim rozpoczniesz, upewnij się, że masz zainstalowane i skonfigurowane następujące narzędzia:
- **Minikube** i **kubectl**
- **Docker** (lub inne środowisko do budowania kontenerów)
- **Java JDK 17+** oraz **Maven** (do budowania backendu)
- **Node.js** i **npm** (do budowania frontendu)

### Krok 1: Uruchomienie klastra Minikube
Rozpocznij od uruchomienia lokalnego klastra:
```bash
minikube start --driver=docker
```

### Krok 2: Wdrożenie aplikacji
Projekt zawiera przygotowany skrypt, który automatycznie zbuduje obrazy Docker wewnątrz Minikube, stworzy bazę danych, zainicjuje tabele i uruchomi wszystkie mikroserwisy.

Będąc w głównym katalogu projektu (`FishNetBackend`), uruchom:
```bash
./scripts/deploy-minikube.sh
```

*Podczas pierwszego uruchomienia skrypt może działać dłuższą chwilę, ponieważ musi pobrać zależności Maven/npm oraz obrazy bazowe z internetu.*

### Krok 3: Dostęp do aplikacji
Gdy skrypt zakończy działanie, aplikacja zostanie wdrożona w klastrze. Aby uzyskać do niej dostęp z przeglądarki, użyj poniższej komendy, która utworzy tunel i wyświetli URL do frontendu:

```bash
minikube service fishing-forum-frontend --url
```

Otwórz wygenerowany link w swojej przeglądarce internetowej.

### Dodatkowe informacje
- Aby sprawdzić status poszczególnych komponentów (podów) w klastrze, użyj polecenia: `kubectl get pods`
- W przypadku wprowadzania zmian w kodzie, wystarczy zbudować nowe obrazy poleceniem `./scripts/build-images.sh`, a następnie zrestartować wybrane pody (np. `kubectl rollout restart deployment/fishing-forum-backend`).
