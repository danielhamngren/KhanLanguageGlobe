import argparse
import pandas as pd
import json


def main():

    args = parse_arguments()

    translation_df = pd.read_csv(args.translation_grade, sep='\t')
    languages_df = pd.read_csv(args.world_languages)

    country_translation = dict()

    for index, row in translation_df.iterrows():

        language = row['language']
        translation = row['translated']
        target_df = languages_df[languages_df['FIRST_OFFICIAL'] == language]
        countries = list(target_df['COUNTRY'])

        for country in countries:
            country_translation[country] = {
                'translation': translation,
                'language': language,
                'country': 'NA'
            }

    with open('test.json', 'w') as out_fh:
        json.dump(country_translation, out_fh, indent=2)


def parse_arguments():

    parser = argparse.ArgumentParser()
    parser.add_argument('--world_languages', required=True)
    parser.add_argument('--translation_grade', required=True)
    parser.add_argument('--output', required=True)
    return parser.parse_args()


if __name__ == '__main__':
    main()
