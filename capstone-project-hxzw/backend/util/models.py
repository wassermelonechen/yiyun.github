from app import api
from flask_restplus import fields

token_details = api.model('token_details',{
    'Token': fields.String(),
    'Nickname': fields.String(),
})

login_details = api.model('login_details', {
  'ID': fields.String(required=True, example='z1111115'),
  'Password': fields.String(required=True, example='123456'),
})

signup_details = api.model('signup_details', {
  'ID': fields.String(required=True, example='z1111120'),
  'Password': fields.String(required=True, example='123456'),
  'Nickname':  fields.String(required=True, example='lunana'),
})
comment_meta_details = api.model('comment_meta_details', {
    'Post':fields.String(),
    'Flag': fields.Integer(),
})

comment_details = api.model('comment_details', {
  'ID': fields.String(required=True, example=1),
  'Time':fields.String(required=True,example='2019-10-23'),
  'Commenter':fields.String(required=True,example= 'z5102636'),
  'Details': fields.String(required = True,example='Good Question!'),
  'CommentVote_good':fields.Integer(required=True,example=1),
  'CommentVote_bad':fields.Integer(required=True,example=1),
})


post_meta_details = api.model('post_meta_details',{
    "NumberOfVotes": fields.Integer(),
    "NumberOfComments": fields.Integer(),
    "comments": fields.Nested(comment_details)
})

post_details = api.model('post_details', {
  "ID": fields.Integer(),
  "Time": fields.String(),  #cannot use times ???
  "Course": fields.String(),
  "Poster": fields.String(),
  "Title": fields.String(),
  "Details":fields.String(),
  "tag":fields.String(),
  "meta":fields.Nested(post_meta_details),
})

auth_details = api.parser().add_argument('Authorization', help="Your Authorization Token in the form 'Token <AUTH_TOKEN>'",location='headers')

post_info = api.model('post_info', {
  "PostID" : fields.Integer(),
})

Tag_s = api.model('Tags', {
  'Tag_id' : fields.String(required=True, example='UI'),
})

class_info = api.model("class_info", {
  "Course" : fields.String(required=True,example='COMP9900'),
})

personal_information = api.model("personal_information",{
  "ID":fields.String(required=True,example='z1111115'),
})

add_consultation_time=api.model("add_consultation_time", {
  "Time": fields.String(required=True,example=1573785123),
  "Details":fields.String(required=True,example="11-18 is luna's birthday") ,
})


post_info_2=api.model("post_info_2",{
  "Time":fields.String(required=True,example="1573785123"),
  "Course":fields.String(required=True,example="COMP9900"),
  "Poster":fields.String(required=True,example="z5102636"),
  "Title":fields.String(required=True,example="what is machine learning"),
  "Details":fields.String(required=True,example="lalllalallalal"),
  "tag":fields.String(required=True,example="machine"),
})


add_comment_detail=api.model("add_comment_detail",{
  "Time":fields.String(required=True,example="1573785123"),
  "Post":fields.String(required=True,example="z5102636"),
  "Details":fields.String(required=True,example="xxxxxxx"),
})

tag_1=api.model("tag_1",{
  "word_1":fields.String(required=True,example="some"),
})

forum_id=api.model("forum_id",{
  "ID": fields.String(required=True,example="1"),
})


person=api.model("person",{
  "ID":fields.String(required=True,example="z5102636"),
  "Name":fields.String(required=True,example="YUE ZHANG"),
  "Gender":fields.String(required=True,example="Female"),
  "Birthday":fields.String(required=True,example="1995-11-18"),
  "Email":fields.String(required=True,example="unswluna@gmail.com"),
})

CourseID=api.model("CourseID",{
  "Course":fields.String(required=True,example="COMP9900"),
})

""" check_commnet_detail=api.model("check_commnet_detail,{
  "Post":fields.String(required=True,example="10"),
}) """

CommentVotes_detail=api.model("CommentVotes_detail",{
  "Comment":fields.Integer(required=True,example=1),
  "Flag":fields.Integer(required=True,example=1),
})

delete_up=api.model("delete_up",{
  "event":fields.String(required=True,example='Ass1 has been released'),
})

ann_de=api.model("ann_de",{
  "Details":fields.String(required=True,example='please go to the webset to check the details'),
})

de_con=api.model("de_con",{
    "Details":fields.String(required=True,example='Ass1 has been released'),
})


ann_ad=api.model("ann_ad",{
  "Course":fields.String(required=True,example="COMP9900"),
  "Details":fields.String(required=True,example="please go to the webset to check the details"),
  "Time":fields.Integer(required=True,example="1573785123"),
  "Title":fields.String(required=True,example="okokok"),
})