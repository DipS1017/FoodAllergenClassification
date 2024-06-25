# Food_new > Allergen30
https://universe.roboflow.com/allergen30/food_new-uuulf

Provided by a Roboflow user
License: CC BY 4.0

#  **Allergen30**


---------------------------------------------------------------------------------------------------------------------------------------


## **About Allergen30**

Allergen30 is created by [Mayank Mishra](https://mmayank74567.github.io/),[ Nikunj Bansal](https://nikunjbansal99.me/), [Tanmay Sarkar](https://scholar.google.com/citations?user=ZlW_23cAAAAJ&hl=en) and [Tanupriya Choudhury](https://scholar.google.co.in/citations?user=tsbYDewAAAAJ&hl=en) with a goal of building a robust detection model that can assist people in avoiding possible allergic reactions.

It contains more than 6,000 images of 30 commonly used food items which can cause an adverse reaction within a human body. This dataset is one of the first research attempts in training a deep learning based computer vision model to detect the presence of such food items from images. It also serves as a benchmark for evaluating the efficacy of object detection methods in learning the otherwise difficult visual cues related to food items.

## **Description of class labels**
There are multiple food items pertaining to specific food intolerances which can trigger an allergic reaction. Such food intolerance primarily include Lactose, Histamine, Gluten, Salicylate, Caffeine and Ovomucoid intolerance. 
![Food intolerance](https://github.com/mmayank74567/mmayank74567.github.io/blob/master/images/FoodIntol.png?raw=true)

The following table contains the description relating to the 30 class labels in our dataset.

| **S. No.**  | **Allergen**           | **Food label**             | **Description** |
| -------- | ---------------------- | -------------------------- | ------------------------- |
| 1 | Ovomucoid          | egg             | Images of egg with yolk (e.g. sunny side up eggs) |
|2	|Ovomucoid	|             whole_egg_boiled | Images of soft and hard boiled eggs|
|3	|Lactose/Histamine|	  milk	|Images of milk in a glass
|4	|Lactose	                    |icecream	|Images of icecream scoops
|5	|Lactose	                    |cheese	|Images of swiss cheese
|6	|Lactose/ Caffeine	    |milk_based_beverage	|Images of tea/ coffee with milk in a cup/glass
|7	|Lactose/Caffeine	      |chocolate	|Images of chocolate bars
|8	|Caffeine	                    |non_milk_based_beverage	|Images of soft drinks and tea/coffee without milk in a cup/glass
|9	|Histamine 	|cooked_meat	|Images of cooked meat
|10	|Histamine 	|raw_meat	|Images of raw meat
|11	|Histamine	|alcohol	|Images of alcohol bottles
|12	|Histamine	|alcohol_glass	|Images of wine glasses with alcohol 
|13	|Histamine	|spinach	|Images of spinach bundle
|14	|Histamine	|avocado	|Images of avocado sliced in half
|15	|Histamine	|eggplant	|Images of eggplant
|16	|Salicylate	|blueberry	|Images of blueberry
|17	|Salicylate	|blackberry	|Images of blackberry
|18	|Salicylate	|strawberry	|Images of strawberry
|19	|Salicylate	|pineapple	|Images of pineapple
|20	|Salicylate	|capsicum	|Images of bell pepper
|21	|Salicylate	|mushroom	|Images of mushrooms
|22	|Salicylate	|dates	|Images of dates
|23	|Salicylate	|almonds	|Images of almonds
|24	|Salicylate	|pistachios	|Images of pistachios
|25	|Salicylate	|tomato	|Images of tomato and tomato slices
|26	|Gluten	|roti	|Images of roti
|27	|Gluten	|pasta	|Images of one serving of penne pasta
|28	|Gluten	|bread	|Images of bread slices
|29	|Gluten	|bread_loaf	|Images of bread loaf
|30	|Gluten	|pizza	|Images of pizza and pizza slices



## **Data collection**
We used search engines (Google and Bing) to crawl and look for suitable images using JavaScript queries for each food item from the list created. The images with incomplete RGB channels were removed, and the images collected from different search engines were compiled. When downloading images from search engines, many images were irrelevant to the purpose, especially the ones with a lot of text in them. We deployed the EAST text detector to segregate such images. Finally, a comprehensive manual inspection was conducted to ensure the relevancy of images in the dataset.

## **Fair use**
This dataset contains some copyrighted material whose use has not been specifically authorized by the copyright owners. In an effort to advance scientific research, we make this material available for academic research. If you wish to use copyrighted material in our dataset for purposes of your own that go beyond non-commercial research and academic purposes, you must obtain permission directly from the copyright owner. We believe this constitutes a 'fair use' of any such copyrighted material as provided for in section 107 of the US Copyright Law. In accordance with Title 17 U.S.C. Section 107, the material on this site is distributed without profit to those who have expressed a prior interest in receiving the included information for non-commercial research and educational purposes.(adapted from [Christopher Thomas](https://people.cs.pitt.edu/~chris/photographer/)). 

## **Citation**

If you find our dataset useful, please cite us as:
```
@article{mishra2022allergen30,
  title={Allergen30: Detecting Food Items with Possible Allergens Using Deep Learning-Based Computer Vision},
  author={Mishra, Mayank and Sarkar, Tanmay and Choudhury, Tanupriya and Bansal, Nikunj and Smaoui, Slim and Rebezov, Maksim and Shariati, Mohammad Ali and Lorenzo, Jose Manuel},
  journal={Food Analytical Methods},
  pages={1--34},
  year={2022},
  publisher={Springer}
}
```









