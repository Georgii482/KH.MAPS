from flask import Flask, render_template, send_from_directory, request, session
import os

app = Flask(__name__)

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route("/YP", methods=["POST", "GET"])
def YP():
    if request.method == "POST":
        if request.is_json:
            data = request.get_json()
            email = data.get("email")
            if not email:
                return {"error": "No email provided"}, 400
            session['email'] = email  
            return {"message": "Email received"}, 200

        email = session.get("email")
        if not email:
            return {"error": "Email not set yet"}, 400

        UPLOAD_FOLDER = f'static/uploads/{email}'
        app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        if 'video' not in request.files:
            return "No video part", 400
        video = request.files['video']
        if video.filename == '':
            return "No selected file", 400

        filename = video.filename
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        video.save(save_path)
        return {"message": "Video uploaded"}, 200

    email = request.args.get("email") or session.get("email")
    if not email:
        return "Email is not set", 400

    UPLOAD_FOLDER = f'static/uploads/{email}'
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    video_files = os.listdir(UPLOAD_FOLDER)
    video_files = [f for f in video_files if f.endswith(".mp4")]
    return render_template("YP.html", videos=video_files, email=email)

@app.route("/AL")
def AL():
    return render_template("Alfa.html")

@app.route("/")
def BR():
    return render_template("Bravo.html")

@app.route("/CH")
def CH():
    return render_template("Charlie.html")

@app.route("/DE", methods=["GET", "POST"])
def De():
    if request.method == "POST":
        if 'video' not in request.files:
            return "No video part", 400
        video = request.files['video']
        if video.filename == '':
            return "No selected file", 400

        filename = video.filename
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        video.save(save_path)

    video_files = os.listdir(app.config['UPLOAD_FOLDER'])
    video_files = [f for f in video_files if f.endswith(".mp4")]
    return render_template("Delta.html", videos=video_files)

if __name__ == "__main__":
    app.run(debug=True)