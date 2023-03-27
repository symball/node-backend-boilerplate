#!/usr/bin/env bash
#!/
#!/# Author Simon Ball <open-source@simonball.me>
# A short shell script used to bootstrap services

#
# DEFAULTS. Should be no need to change these
#
red=`tput setaf 1`
green=`tput setaf 2`
blue=`tput setaf 4`
reset=`tput sgr0`
DEFAULT_PATH=$(pwd)
VERBOSE=true

#
# ENVIRONMENT SPECIFIC. This is the section you will want to change
#
REQUIRED_PROGRAMS="docker docker-compose nc pnpm"
REQUIRED_PORTS="3000 5432"

echo "${green}--=== Backend Bootstrap dev Script ===--${reset}"
echo ""
echo "This is a script to get your backend up and running"
#
# HALT
#
# Safe method for stopping dev environment. If running the main
# process in foreground, will also shutdown services
#
halt() {
  echo "${red}--=== HALTING ===--${reset}"
  echo ""
  echo "${green}$1${reset}"
  echo ""
  cd $DEFAULT_PATH && docker-compose down
  echo "$1"
  exit 1
}

trap halt SIGHUP SIGINT SIGTERM

# Function to check whether command exists or not
exists()
{
  if command -v $1 &>/dev/null
    then return 0
    else return 1
  fi
}

path_exists() {
  if [ -d $1 ]
    then return 0
    else return 1
  fi
}

ok() {
  echo -e " ${green}OK${reset}"
}

# Command help
display_usage() {
  echo "Get a basic environment up and running to use for Pledgecamp E2E Testing"
  echo ""
  echo " -h --help               Show this message"
  echo " -q --quiet              Remove verbosity"
  echo " -x --stop               Run the halt procedure"
  halt
}

# Parameter parsing
for argument in "$@"; do
  case "$argument" in
    --help|-h)
      display_help
      ;;
    --quiet|-q)
      VERBOSE=false
      ;;
    --stop|-x)
      down
      ;;
  esac
  shift
done

#
# BASIC PREPARATION
#
docker-compose down
# Check whether the required programs installed
[ "$VERBOSE" = true ] && echo "---=== Checking required programs ===---"
for PROGRAM in $REQUIRED_PROGRAMS; do
  if exists $PROGRAM; then
    [ "$VERBOSE" = true ] && echo -ne "$PROGRAM" && ok
  else halt "$PROGRAM Required"
  fi
done

# Check whether ports are available
[ "$VERBOSE" = true ] && echo "---=== Checking required Ports ===---"
for PORT in $REQUIRED_PORTS; do
  PORT_RESULT="$(lsof -i :${PORT})"
  if [ -z "$PORT_RESULT" ]; then
    [ "$VERBOSE" = true ] && echo -ne "$PORT" && ok
  else halt "Port $PORT already in use"
  fi
done

# Startup the docker services
docker-compose up -d
until nc -w 10 127.0.0.1 5432; do echo 'Waiting for Postgres'; sleep 1; done

pnpm i
pnpm run prisma:migrate
pnpm run prisma:seed
pnpm run dev

halt User quit
