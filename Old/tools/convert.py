##adds colons to the html to make it xul compatable
import argparse

def getArgParse():
  parser = argparse.ArgumentParser(
      description='Adds ":html" to convert html to xul')
  parser.add_argument(
      '-i', '--input_file',
      type=str,
      help='file to read')
  parser.add_argument(
      '-o', '--output_file',
      type=str,
      default='out.xul',
      help='file with xul')
  return parser

def convert_xul(s):
    return s.replace("<", "<html:")

if __name__=="__main__":
    args = getArgParse().parse_args()
    input_file = args.input_file
    output_file = args.output_file
    f = open(input_file,"r")
    w = open(output_file,"w")
    s = f.read()
    w.write(convert_xul(s))
    f.close()
    w.close()
