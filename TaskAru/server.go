package main

import (
	"log"
	"net/http"

	"TaskAru/controllers"
	"TaskAru/models"

	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/rs/cors"
)

var store = sessions.NewCookieStore([]byte("T$KR012623"))

func main() {
	//templates = template.Must(template.ParseGlob("templates/*.html"))
	handler := cors.New(cors.Options{
		AllowedOrigins:     []string{"http://localhost:4200"},
		AllowedMethods:     []string{"GET", "OPTIONS", "POST"},
		AllowedHeaders:     []string{"Accept", "Content-Type", "Content-Length", "Accept-Encoding", "Authorization", "X-CSRF-Token", "Origin"},
		OptionsPassthrough: true,
		AllowCredentials:   true,
	})

	r := mux.NewRouter()
	models.Init()
	//r.HandleFunc("/", homeGetHandler).Methods("GET")
	//r.HandleFunc("/", homePostHandler).Methods("POST")
	r.HandleFunc("/register", controllers.RegisterPostHandler).Methods("POST")
	//r.HandleFunc("/login", loginGetHandler).Methods("GET")
	//r.HandleFunc("/login", loginPostHandler).Methods("POST")
	//r.HandleFunc("/test", testGetHandler).Methods("GET")
	//fs := http.FileServer(http.Dir("./static/"))
	//r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", fs))
	//http.Handle("/", r)
	log.Fatal(http.ListenAndServe(":8080", handler.Handler(r)))

}

/*func homeGetHandler(w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, "session")
	_, ok := session.Values["username"]
	if !ok {
		http.Redirect(w, r, "/login", 302)
		return
	}
	templates.ExecuteTemplate(w, "home.html", nil)
}

func homePostHandler(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "/", 302)
}

func loginGetHandler(w http.ResponseWriter, r *http.Request) {
	templates.ExecuteTemplate(w, "login.html", nil)
}

func loginPostHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	username := r.PostForm.Get("username")
	password := r.PostForm.Get("password")
	hash, err := client.Get("user" + username).Bytes()
	if err != nil {
		return
	}
	err = bcrypt.CompareHashAndPassword(hash, []byte(password))
	if err != nil {
		return
	}
	session, _ := store.Get(r, "session")
	session.Values["username"] = username
	session.Save(r, w)
	http.Redirect(w, r, "/", 302)
}

// func testGetHandler(w http.ResponseWriter, r *http.Request) {
// 	session, _ := store.Get(r, "session")
// 	untyped, ok := session.Values["username"]
// 	if !ok {
// 		return
// 	}
// 	username, ok := untyped.(string)
// 	if !ok {
// 		return
// 	}
// 	w.Write([]byte(username))
// }

func registerGetHandler(w http.ResponseWriter, r *http.Request) {
	templates.ExecuteTemplate(w, "register.html", nil)
}
*/
