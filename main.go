package main

import (
	"encoding/base64"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)


type FileInput struct {
   File string  `json:"file"`
   Ext string   `json:"ext"`
}


func main()  {
  

	server := gin.Default()
	server.Static("/public","./public")

	server.GET("/test",func(ctx *gin.Context){
		ctx.JSON(200,gin.H{
			"message":"Ok working fine",
		})
	}) 

	// base-64 file 
	server.POST("/base64",func(ctx *gin.Context) {

		var _file FileInput 
		err := ctx.BindJSON(&_file)

	
		if err != nil {
			ctx.JSON(500, gin.H{"error": err.Error()})
			return
		}

	

		fileName := "base64/"+ strconv.Itoa(time.Now().Nanosecond()) +"."+ _file.Ext  

		b64data := _file.File[strings.IndexByte(_file.File, ',')+1:]

		dec,err := base64.StdEncoding.DecodeString(b64data) 

		if err != nil {
			panic(err)
		}

		f,err := os.Create(fileName) 

		defer f.Close() 

		if _,err := f.Write(dec);err != nil{
			panic(err)
		}

		if err:= f.Sync();err  !=nil {
			panic(err)
		}

		fmt.Println(fileName) 

		ctx.JSON(200,gin.H{
			"message":"Ok working fine",
		})
	})

    server.POST("/upload",func(ctx *gin.Context) {

		file,_ := ctx.FormFile("file") 
        ext := filepath.Ext(file.Filename) 
		fileName := strconv.Itoa(time.Now().Nanosecond()) +"."+ ext
		

		ctx.SaveUploadedFile(file,"./files/"+fileName)

		ctx.JSON(200,gin.H{
			"message":"Ok working fine",
		})
	})

	server.Run(":4000")
	fmt.Println("Server is running on port 4000 ")
}