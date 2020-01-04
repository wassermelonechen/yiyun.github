Installation
===
basic environment
--
Python 3.6 must be installed in advance and Google Chrome as the browser is highly recommended.  
Also JavaScript is needed.  

flask
---


Then install flask by typing following code in terminal:
pip3 install flask
pip3 install flask_restplus
pip3 install flask_cors

nltk
---
Install and Download specific Libraries of Python in terminal, involving nltk, tensorflow, keras, symspellpy, sklearn, pickle, websocket_server.
pip3 install nltk
After installing the nltk library, import it so that built-in resources will be automatically downloaded
 
 ![image](https://github.com/comp3300-comp9900-term-3-2019/capstone-project-hxzw/blob/master/images/1.png)
 ![image](https://github.com/comp3300-comp9900-term-3-2019/capstone-project-hxzw/blob/master/images/2.png)
 
others
---
pip3 install tensorflow  
pip3 install keras  
pip3 install -U symspellpy  
pip3 install sklearn  
pip3 install pickle  
pip3 install websocket_server  
 
 
How to run our project
===
After installation, several py files need to be executed.

**Our chatbot component is too huge, please go to following google drive link to download our chatbot component**
https://drive.google.com/open?id=1_tViGzG-ijqIE8Vv_D_eV1r3o-u4RBcp

**Firstly, in chatbot folder, run these files in order:**  
seq2seq & IR/seq2seq_chatbot/seq2seq_chat.py  
seq2seq & IR/retrieval_chatbot/retrieval_chatbot.py  
spelling correction/spelling_correction.py  
toxic_judge/program & data/toxic_predict.py  
router.py  

Later, run backend/backend_server.py to call the backend server.
After the steps above, run frontend/frontend_server.py in the file called web. At this time, some users could receive a pop-up window, as shown below, just click ‘Allow’.
 ![image](https://github.com/comp3300-comp9900-term-3-2019/capstone-project-hxzw/blob/master/images/3.png)
 
When all the mentioned operations have been done, users can get url: http://localhost:8080 and type the address in any browser. New users will have to fill in the username and password.
Default username: user
Default password: 1234

![image](https://github.com/comp3300-comp9900-term-3-2019/capstone-project-hxzw/blob/master/images/4.png)












Finally, users can experience the product on their own.
