cd $(git rev-parse --show-toplevel)/wlcommon
yarn build || exit $?
(cd ../wlclient;yarn add file:../wlcommon)
(cd ../wlserver;yarn add file:../wlcommon)
