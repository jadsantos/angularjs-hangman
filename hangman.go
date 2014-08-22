package hangman

import (
    "net/http"
    )
 
func handle(w http.ResponseWriter, r *http.Request) {
    http.ServeFile(w, r, r.URL.Path[1:])
}

func init() {
    http.HandleFunc("/", handle)
}